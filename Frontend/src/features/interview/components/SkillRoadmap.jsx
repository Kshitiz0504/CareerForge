import React, { useState } from 'react'

const Chevron = ({ open }) => (
    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
    </span>
)

const SkillGapCard = ({ gap }) => {
    const [ open, setOpen ] = useState(false)

    const importance = gap.importance || (gap.severity === 'high' ? 'High' : gap.severity === 'medium' ? 'Medium' : 'Low')

    return (
        <div className='skill-gap-card'>
            <div className='skill-gap-card__header' onClick={() => setOpen(o => !o)}>
                <div className='skill-gap-card__title'>
                    <span className={`skill-gap-card__dot skill-gap-card__dot--${gap.severity}`} />
                    <h4>{gap.skill}</h4>
                </div>
                <div className='skill-gap-card__meta'>
                    <span className={`pill pill--${importance.toLowerCase()}`}>{importance} Priority</span>
                    {gap.estimatedLearningTime && <span className='skill-gap-card__time'>{gap.estimatedLearningTime}</span>}
                    <Chevron open={open} />
                </div>
            </div>
            {open && (
                <div className='skill-gap-card__body'>
                    {gap.difficulty && (
                        <span className='q-card__tag q-card__tag--intention'>{gap.difficulty} Level</span>
                    )}
                    {gap.whyItMatters && <p>{gap.whyItMatters}</p>}
                </div>
            )}
        </div>
    )
}

const RoadmapWeek = ({ week, defaultOpen = false }) => {
    const [ open, setOpen ] = useState(defaultOpen)

    return (
        <div className='roadmap-week'>
            <div className='roadmap-week__header' onClick={() => setOpen(o => !o)}>
                <span className='roadmap-week__badge'>Week {week.week}</span>
                <span className='roadmap-week__summary'>{(week.goals || []).length} goals &bull; {(week.topics || []).length} topics</span>
                <Chevron open={open} />
            </div>
            {open && (
                <div className='roadmap-week__body'>
                    {week.goals?.length > 0 && (
                        <div className='roadmap-week__section'>
                            <p className='roadmap-week__label'>Learning Goals</p>
                            <ul className='roadmap-week__goals'>
                                {week.goals.map((g, i) => <li key={i}>{g}</li>)}
                            </ul>
                        </div>
                    )}
                    {week.topics?.length > 0 && (
                        <div className='roadmap-week__section'>
                            <p className='roadmap-week__label'>Recommended Topics</p>
                            <div className='roadmap-week__topics'>
                                {week.topics.map((t, i) => <span key={i} className='topic-chip'>{t}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const SkillRoadmap = ({ skillGaps = [], learningRoadmap = [] }) => {
    return (
        <div className='skill-roadmap'>
            <div className='skill-roadmap__block'>
                <p className='skill-roadmap__heading'>Missing Skills</p>
                {skillGaps.length === 0 ? (
                    <p className='skill-roadmap__empty'>No skill gaps identified &mdash; great match!</p>
                ) : (
                    <div className='skill-gap-list'>
                        {skillGaps.map((gap, i) => <SkillGapCard key={i} gap={gap} />)}
                    </div>
                )}
            </div>

            <div className='skill-roadmap__block'>
                <p className='skill-roadmap__heading'>4-Week Learning Roadmap</p>
                {learningRoadmap.length === 0 ? (
                    <p className='skill-roadmap__empty'>No learning roadmap available for this report.</p>
                ) : (
                    <div className='roadmap-weeks'>
                        {learningRoadmap.map((week, i) => (
                            <RoadmapWeek key={week.week ?? i} week={week} defaultOpen={i === 0} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SkillRoadmap
