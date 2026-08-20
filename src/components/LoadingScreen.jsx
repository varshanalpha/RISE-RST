import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

const steps = [
  "Resume received",
  "Reading candidate information",
  "Comparing with job requirements",
  "Preparing your insights"
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 800);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] animate-fade-in px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">Analyzing your profile</h1>
          <p className="text-gray-500">This may take a few seconds.</p>
        </div>
        
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className="w-6 h-6 mr-4 flex items-center justify-center flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 animate-fade-in">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-3 h-3 border-2 border-gray-200 rounded-full" />
                  )}
                </div>
                <span className={`text-sm md:text-base font-medium transition-colors duration-300 ${
                  isCompleted ? 'text-gray-900' : isCurrent ? 'text-teal-700' : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
