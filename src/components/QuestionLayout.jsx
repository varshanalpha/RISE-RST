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
  validationMessage = "",
  isWelcome = false
}) {
  return (
    <div className="min-h-screen relative flex flex-col items-center bg-[#F8FBFA] font-sans overflow-hidden pb-12">
      
      {/* Subtle Floating Decorative Elements */}
      <div className="absolute top-12 left-10 w-24 h-32 bg-white/40 border border-[#DDE8E5]/40 rounded-lg shadow-sm -rotate-12 pointer-events-none flex flex-col p-2 gap-1.5 opacity-30 select-none">
        <div className="w-5 h-5 rounded-full bg-teal-100/50"></div>
        <div className="w-full h-1.5 bg-gray-200/50 rounded"></div>
        <div className="w-5/6 h-1.5 bg-gray-200/50 rounded"></div>
        <div className="w-4/5 h-1.5 bg-gray-200/50 rounded"></div>
      </div>
      <div className="absolute bottom-24 right-12 w-28 h-36 bg-white/40 border border-[#DDE8E5]/40 rounded-lg shadow-sm rotate-12 pointer-events-none flex flex-col p-3 gap-2 opacity-30 select-none">
        <div className="w-6 h-6 rounded-full bg-teal-100/50"></div>
        <div className="w-full h-2 bg-gray-200/50 rounded"></div>
        <div className="w-11/12 h-2 bg-gray-200/50 rounded"></div>
        <div className="w-3/4 h-2 bg-gray-200/50 rounded"></div>
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#EAF7F4]/60 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] bg-teal-50/40 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-5xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#10202B] rounded-sm transform rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#087F73] rounded-sm transform -rotate-45"></div>
          </div>
          <span className="font-bold text-[#10202B] text-lg tracking-tight">Screenly</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`w-full ${maxWidth} px-4 flex-1 flex flex-col items-center justify-center z-10 mt-2 md:mt-4`}>
        {currentStep > 0 && currentStep <= totalSteps && (
          <div className="w-full max-w-md mb-6">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        )}

        <div className="w-full flex-1 flex flex-col justify-center animate-slide-up">
          {/* Main Card Container */}
          <div className="w-full bg-white rounded-[24px] md:rounded-[28px] border border-[#DDE8E5] shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6 md:p-10 lg:p-12">
            
            {(question || subtitle) && (
              <div className="mb-8 text-center">
                {isWelcome && (
                  <span className="inline-block text-[11px] font-extrabold text-[#087F73] uppercase tracking-[0.2em] bg-[#EAF7F4] px-3.5 py-1.5 rounded-full border border-teal-100/50 mb-4">
                    AI-POWERED SCREENING
                  </span>
                )}
                {question && <h1 className="text-3xl md:text-[36px] font-bold text-[#10202B] tracking-tight leading-tight mb-4">{question}</h1>}
                
                {isWelcome && <div className="w-12 h-[3px] bg-[#087F73] mx-auto mb-5 rounded-full"></div>}
                
                {subtitle && <p className="text-[#6B7780] text-[16px] md:text-[17px] leading-relaxed max-w-2xl mx-auto">{subtitle}</p>}
              </div>
            )}

            <div className="flex-1">
              {children}
            </div>

            {/* Footer inside the card for unified steps, but below the card for welcome screen */}
            {!isWelcome && (
              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-gray-100 gap-4">
                <div>
                  {onBack ? (
                    <button 
                      onClick={onBack}
                      className="flex items-center text-[#6B7780] hover:text-[#10202B] font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
                  {continueDisabled && validationMessage && (
                    <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-lg border border-amber-100 animate-fade-in">
                      {validationMessage}
                    </span>
                  )}
                  {!hideContinue && (
                    <button
                      onClick={onContinue}
                      disabled={continueDisabled}
                      className={`w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5
                        ${continueDisabled 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#087F73] text-white hover:bg-[#076b61] shadow-[0_4px_14px_rgba(8,127,115,0.2)] hover:shadow-[0_6px_20px_rgba(8,127,115,0.25)]'
                        }`}
                    >
                      {continueText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Welcome Screen CTA below the card */}
          {isWelcome && !hideContinue && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={onContinue}
                className="flex items-center justify-center px-10 py-4 bg-[#087F73] hover:bg-[#076b61] text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(8,127,115,0.2)] hover:shadow-[0_6px_20px_rgba(8,127,115,0.25)]"
              >
                {continueText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
