import React from 'react'

const scoreClass = (value) =>
    value >= 80 ? 'score--high' : value >= 60 ? 'score--mid' : 'score--low'

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
)

const WarnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
)

const ATSScoreDashboard = ({ atsScore }) => {

    if (!atsScore) {
        return (
            <div className='ats-empty'>
                <p>ATS score data is not available for this report.</p>
            </div>
        )
    }

    const metrics = [
        { label: 'Resume Formatting', value: atsScore.formattingScore ?? 0 },
        { label: 'Keyword Match', value: atsScore.keywordMatchScore ?? 0 },
        { label: 'Project Quality', value: atsScore.projectQualityScore ?? 0 },
        { label: 'Skills Match', value: atsScore.skillsMatchScore ?? 0 },
        { label: 'Action Verb Usage', value: atsScore.actionVerbUsageScore ?? 0 },
    ]

    const overall = atsScore.overallScore ?? 0

    return (
        <div className='ats-dashboard'>

            {/* Overall Score + Metric Bars */}
            <div className='ats-summary'>
                <div className='ats-overall'>
                    <div className={`ats-overall__ring ${scoreClass(overall)}`}>
                        <span className='ats-overall__value'>{overall}</span>
                        <span className='ats-overall__max'>/ 100</span>
                    </div>
                    <p className='ats-overall__label'>Overall ATS Score</p>
                </div>

                <div className='ats-metrics'>
                    {metrics.map((m) => (
                        <div key={m.label} className='ats-metric'>
                            <div className='ats-metric__header'>
                                <span className='ats-metric__label'>{m.label}</span>
                                <span className={`ats-metric__value ${scoreClass(m.value)}`}>{m.value}%</span>
                            </div>
                            <div className='ats-metric__track'>
                                <div className={`ats-metric__fill ${scoreClass(m.value)}`} style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths / Improvements */}
            <div className='ats-feedback'>
                <div className='ats-feedback__card ats-feedback__card--good'>
                    <h3><span className='ats-feedback__icon'><CheckIcon /></span> Resume Strengths</h3>
                    <ul>
                        {(atsScore.strengths || []).map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </div>

                <div className='ats-feedback__card ats-feedback__card--warn'>
                    <h3><span className='ats-feedback__icon'><WarnIcon /></span> Areas to Improve</h3>
                    <ul>
                        {(atsScore.improvements || []).map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ATSScoreDashboard
