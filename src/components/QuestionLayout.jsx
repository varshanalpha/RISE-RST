import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function QuestionLayout({
  question,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  continueDisabled,
  continueText = "Continue",
  hideContinue = false,
  maxWidth = "max-w-3xl",
  validationMessage = ""
}) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] animate-fade-in font-sans pb-12">
      {/* Header */}
      <header className="w-full max-w-4xl px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold text-lg text-gray-900 tracking-tight">Screenly</span>
        </div>
        {currentStep > 0 && currentStep <= totalSteps && (
          <div className="text-sm font-medium text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`w-full ${maxWidth} px-6 flex-1 flex flex-col mt-2 md:mt-4`}>
        {currentStep > 0 && currentStep <= totalSteps && (
          <div className="mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        )}

        <div className="flex-1 animate-slide-up flex flex-col">
          {(question || subtitle) && (
            <div className="mb-8 text-center md:text-left">
              {question && <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-tight">{question}</h1>}
              {subtitle && <p className="text-gray-500 text-base md:text-lg">{subtitle}</p>}
            </div>
          )}
          
          <div className="flex-1 mb-8">
            {children}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
            <div>
              {onBack ? (
                <button 
                  onClick={onBack}
                  className="flex items-center text-gray-500 hover:text-gray-800 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              ) : (
                <div></div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {continueDisabled && validationMessage && (
                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 animate-fade-in">
                  {validationMessage}
                </span>
              )}
              {!hideContinue && (
                <button
                  onClick={onContinue}
                  disabled={continueDisabled}
                  className={`w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-medium transition-all
                    ${continueDisabled 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-md'
                    }`}
                >
                  {continueText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
