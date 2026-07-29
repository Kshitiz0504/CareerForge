import { createContext, useState } from "react";


export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    // tracks which question type ('technical' | 'behavioral') is currently being generated, if any
    const [questionsLoading, setQuestionsLoading] = useState(null)

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports, questionsLoading, setQuestionsLoading }}>
            {children}
        </InterviewContext.Provider>
    )
}