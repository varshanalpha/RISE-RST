import React from 'react';

export default function TextArea({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#10202B] mb-2">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[#DDE8E5] bg-white focus:outline-none focus:border-[#087F73] focus:ring-2 focus:ring-[#EAF7F4] transition-all resize-y min-h-[220px] text-sm text-[#10202B] placeholder-[#6B7780] font-sans"
        maxLength={maxLength}
      />
      {maxLength && (
        <div className="mt-1 text-right text-xs font-semibold text-[#6B7780]">
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
}
