import React from 'react'
import Spinner from './Spinner'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

const GenerateMoreQuestions = ({ type, onGenerate, isLoading }) => (
    <div className='more-questions'>
        <button
            type='button'
            className='more-questions__button'
            disabled={isLoading}
            onClick={() => onGenerate(type)}
        >
            {isLoading ? (
                <>
                    <Spinner size={14} />
                    Generating {type === 'technical' ? 'technical' : 'behavioral'} questions...
                </>
            ) : (
                <>
                    <PlusIcon />
                    Generate More Questions
                </>
            )}
        </button>
    </div>
)

export default GenerateMoreQuestions
