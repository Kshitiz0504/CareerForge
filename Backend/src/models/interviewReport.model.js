const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    },
    importance: {
        type: String,
        enum: [ "High", "Medium", "Low" ]
    },
    estimatedLearningTime: {
        type: String
    },
    difficulty: {
        type: String,
        enum: [ "Beginner", "Intermediate", "Advanced" ]
    },
    whyItMatters: {
        type: String
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
})

const learningRoadmapWeekSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: [ true, "Week is required" ]
    },
    goals: [ { type: String } ],
    topics: [ { type: String } ]
}, {
    _id: false
})

const atsScoreSchema = new mongoose.Schema({
    overallScore: { type: Number, min: 0, max: 100 },
    formattingScore: { type: Number, min: 0, max: 100 },
    keywordMatchScore: { type: Number, min: 0, max: 100 },
    projectQualityScore: { type: Number, min: 0, max: 100 },
    skillsMatchScore: { type: Number, min: 0, max: 100 },
    actionVerbUsageScore: { type: Number, min: 0, max: 100 },
    strengths: [ { type: String } ],
    improvements: [ { type: String } ]
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    learningRoadmap: [ learningRoadmapWeekSchema ],
    atsScore: atsScoreSchema,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;  