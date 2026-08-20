import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
  // Generate dots and lines
  const elements = [];
  
  for (let i = 1; i <= totalSteps; i++) {
    const isCompleted = i < currentStep;
    const isCurrent = i === currentStep;
    
    // Dot
    elements.push(
      <div 
        key={`dot-${i}`}
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          isCompleted ? 'bg-teal-600' : isCurrent ? 'bg-teal-600 ring-4 ring-teal-100' : 'bg-gray-200'
        }`}
      />
    );
    
    // Line (except after the last dot)
    if (i < totalSteps) {
      elements.push(
        <div 
          key={`line-${i}`}
          className={`flex-1 h-[2px] mx-2 rounded transition-colors duration-300 ${
            isCompleted ? 'bg-teal-600' : 'bg-gray-200'
          }`}
        />
      );
    }
  }

  return (
    <div className="flex items-center w-full">
      {elements}
    </div>
  );
}
