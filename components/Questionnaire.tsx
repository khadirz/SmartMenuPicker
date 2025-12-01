import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { UserPreferences } from '../types';

interface QuestionnaireProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserPreferences>>({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 250); // Slight delay for visual feedback
    } else {
      onComplete(newAnswers as UserPreferences);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full flex flex-col min-h-[60vh]">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-brand-500 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <div className="mb-2 text-brand-600 font-semibold text-sm uppercase tracking-wide">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
          {currentQuestion.text}
        </h2>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className="group relative flex items-center w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <div className="flex-1">
                <span className="block font-medium text-slate-700 group-hover:text-brand-900 text-lg">
                  {option.label}
                </span>
              </div>
              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm">
        Your preferences help us find your perfect match.
      </div>
    </div>
  );
};

export default Questionnaire;