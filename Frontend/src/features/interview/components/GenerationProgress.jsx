import React, { useEffect, useState } from 'react'

const STEPS = [
    'Uploading Resume',
    'Extracting Resume Content',
    'Understanding Job Description',
    'Comparing Resume with JD',
    'Calculating Match Score',
    'Generating Interview Questions',
    'Creating Learning Roadmap',
    'Finalizing Report',
]

const TOTAL_ESTIMATE_SECONDS = 30

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
)

/**
 * Animated step-by-step progress card shown while the AI report is being generated.
 * The backend call is a single request, so progress through the steps is simulated
 * against a realistic estimate and holds on the final step until the request resolves.
 */
const GenerationProgress = ({ active }) => {
    const [ currentStep, setCurrentStep ] = useState(0)
    const [ remaining, setRemaining ] = useState(TOTAL_ESTIMATE_SECONDS)

    useEffect(() => {
        if (!active) return

        const stepDurationMs = (TOTAL_ESTIMATE_SECONDS * 1000) / STEPS.length

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
        }, stepDurationMs)

        const tickInterval = setInterval(() => {
            setRemaining(prev => (prev > 1 ? prev - 1 : 1))
        }, 1000)

        return () => {
            clearInterval(stepInterval)
            clearInterval(tickInterval)
        }
    }, [ active ])

    if (!active) return null

    return (
        <div className='generation-progress'>
            <div className='generation-progress__header'>
                <span className='generation-progress__spinner' />
                <div className='generation-progress__headings'>
                    <p className='generation-progress__title'>Generating your interview strategy&hellip;</p>
                    <p className='generation-progress__subtitle'>Estimated time remaining: ~{remaining}s</p>
                </div>
            </div>

            <ul className='generation-progress__steps'>
                {STEPS.map((step, i) => {
                    const state = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending'
                    return (
                        <li key={step} className={`generation-progress__step generation-progress__step--${state}`}>
                            <span className='generation-progress__icon'>
                                {state === 'done' && <CheckIcon />}
                                {state === 'active' && <span className='generation-progress__dot' />}
                            </span>
                            <span>{step}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default GenerationProgress
