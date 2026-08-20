import React from 'react';

export default function TextArea({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all resize-y min-h-[220px]"
        maxLength={maxLength}
      />
      {maxLength && (
        <div className="mt-2 text-right text-sm text-gray-500">
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
}
