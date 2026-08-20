import React from 'react';
import { Check } from 'lucide-react';

export default function OptionCard({ icon: Icon, label, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center relative overflow-hidden
        ${selected 
          ? 'border-teal-500 bg-teal-50' 
          : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-gray-50'
        }`}
    >
      <div className={`p-3 rounded-lg mr-4 transition-colors ${
        selected ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${selected ? 'text-teal-900' : 'text-gray-900'}`}>
          {label}
        </h3>
        {description && (
          <p className={`text-sm mt-0.5 ${selected ? 'text-teal-700' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      {selected && (
        <div className="absolute right-4 text-teal-600 animate-fade-in">
          <Check className="w-5 h-5" />
        </div>
      )}
    </button>
  );
}
