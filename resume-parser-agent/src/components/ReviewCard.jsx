import React from 'react';

export default function ReviewCard({ title, onEdit, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm relative group">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h4>
        <button 
          onClick={onEdit}
          className="text-sm text-teal-600 hover:text-teal-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Edit
        </button>
      </div>
      <div className="text-gray-900">
        {children}
      </div>
    </div>
  );
}
