const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking, e.g. Docker, AWS, Next.js, TypeScript etc."),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"),
        importance: z.enum([ "High", "Medium", "Low" ]).describe("How important this skill is for the selected job"),
        estimatedLearningTime: z.string().describe("A short human readable estimate of how long it would take to learn this skill, e.g. '1-2 weeks'"),
        difficulty: z.enum([ "Beginner", "Intermediate", "Advanced" ]).describe("The difficulty level of learning this skill"),
        whyItMatters: z.string().describe("A short explanation of why this skill matters for the selected job")
    })).describe("List of skill gaps in the candidate's profile along with their severity, importance, estimated learning time, difficulty and why they matter"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    learningRoadmap: z.array(z.object({
        week: z.number().describe("The week number in the learning roadmap, starting from 1, should cover 4 weeks"),
        goals: z.array(z.string()).describe("The learning goals to achieve during this week, tied to the candidate's skill gaps"),
        topics: z.array(z.string()).describe("Recommended topics to study during this week")
    })).describe("A 4-week, week-wise learning roadmap that helps the candidate close their skill gaps before the interview"),
    atsScore: z.object({
        overallScore: z.number().describe("Overall ATS score between 0 and 100 for the resume"),
        formattingScore: z.number().describe("Score between 0 and 100 for how well the resume is formatted for ATS parsing"),
        keywordMatchScore: z.number().describe("Score between 0 and 100 for how well the resume keywords match the job description"),
        projectQualityScore: z.number().describe("Score between 0 and 100 for the quality and relevance of the projects listed in the resume"),
        skillsMatchScore: z.number().describe("Score between 0 and 100 for how well the candidate's skills match the job requirements"),
        actionVerbUsageScore: z.number().describe("Score between 0 and 100 for the effective use of strong action verbs in the resume"),
        strengths: z.array(z.string()).describe("A list of the resume's key strengths, e.g. 'Strong technical projects', 'Good use of action verbs', 'Proper formatting'"),
        improvements: z.array(z.string()).describe("A list of concrete areas to improve in the resume, e.g. 'Missing cloud-related keywords', 'Add quantified achievements'")
    }).describe("An ATS (Applicant Tracking System) resume score breakdown along with strengths and areas to improve"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)

}


const followUpQuestionsSchema = z.object({
    questions: z.array(z.object({
        question: z.string().describe("The interview question"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Exactly 5 new interview questions")
})

/**
 * @description Generates 5 additional technical or behavioral interview questions,
 * avoiding duplicates of the questions already generated for this report.
 */
async function generateFollowUpQuestions({ resume, selfDescription, jobDescription, type, existingQuestions = [] }) {

    const questionTypeLabel = type === "behavioral" ? "behavioral" : "technical"

    const prompt = `Generate exactly 5 new ${questionTypeLabel} interview questions for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The candidate has already been asked the following ${questionTypeLabel} questions, so DO NOT repeat these or generate close variations of them:
                        ${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n") || "None yet."}

                        Return exactly 5 new, distinct ${questionTypeLabel} questions along with the interviewer's intention behind each question and a model answer.
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(followUpQuestionsSchema),
        }
    })

    const parsed = JSON.parse(response.text)

    return parsed.questions
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf, generateFollowUpQuestions }