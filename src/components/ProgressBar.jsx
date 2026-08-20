import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
  const elements = [];
  
  for (let i = 1; i <= totalSteps; i++) {
    const isCompleted = i < currentStep;
    const isCurrent = i === currentStep;
    const isFuture = i > currentStep;
    
    // Dot Node
    elements.push(
      <div 
        key={`dot-${i}`}
        className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
          !isFuture 
            ? 'bg-[#087F73]' 
            : 'bg-transparent border-2 border-gray-300'
        }`}
      />
    );
    
    // Line Connector (except after the last dot)
    if (i < totalSteps) {
      elements.push(
        <div 
          key={`line-${i}`}
          className={`flex-1 h-[2px] mx-1 transition-colors duration-300 ${
            isCompleted ? 'bg-[#087F73]' : 'bg-gray-200'
          }`}
        />
      );
    }
  }

  return (
    <div className="flex items-center w-full max-w-sm mx-auto">
      {elements}
    </div>
  );
}
