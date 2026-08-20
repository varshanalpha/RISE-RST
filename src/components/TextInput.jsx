import React from 'react';

export default function TextInput({ label, type = 'text', value, onChange, placeholder, required, error }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all
          ${error 
            ? 'border-red-300 focus:ring-red-200' 
            : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
          }`}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
