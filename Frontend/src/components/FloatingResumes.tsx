import React from 'react';

interface ResumeSvgProps {
  className?: string;
  style?: React.CSSProperties;
}

const ResumeSvg = ({ className, style }: ResumeSvgProps) => (
  <svg 
    viewBox="0 0 240 320" 
    className={`bg-slate-900 border border-slate-700 shadow-xl rounded-md ${className}`}
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Header area with profile pic placeholder */}
    <rect x="20" y="25" width="40" height="40" rx="20" fill="#334155" />
    <rect x="75" y="30" width="100" height="12" rx="4" fill="#64748B" />
    <rect x="75" y="50" width="70" height="8" rx="4" fill="#475569" />
    
    {/* Divider */}
    <line x1="20" y1="85" x2="220" y2="85" stroke="#334155" strokeWidth="2" />
    
    {/* Body content */}
    {/* Section 1 */}
    <rect x="20" y="105" width="60" height="8" rx="4" fill="#94A3B8" />
    <rect x="20" y="125" width="200" height="6" rx="3" fill="#475569" />
    <rect x="20" y="140" width="180" height="6" rx="3" fill="#475569" />
    <rect x="20" y="155" width="150" height="6" rx="3" fill="#475569" />
    
    {/* Section 2 */}
    <rect x="20" y="185" width="50" height="8" rx="4" fill="#94A3B8" />
    <rect x="20" y="205" width="190" height="6" rx="3" fill="#475569" />
    <rect x="20" y="220" width="170" height="6" rx="3" fill="#475569" />
    <rect x="20" y="235" width="180" height="6" rx="3" fill="#475569" />
    
    {/* Accents representing skills/tags */}
    <rect x="20" y="270" width="40" height="14" rx="4" fill="#1E40AF" stroke="#2563EB" />
    <rect x="65" y="270" width="30" height="14" rx="4" fill="#065F46" stroke="#059669" />
    <rect x="100" y="270" width="45" height="14" rx="4" fill="#991B1B" stroke="#DC2626" />
  </svg>
);

const FloatingResumes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-80">
      <ResumeSvg className="absolute top-[5%] left-[5%] animate-float-1 w-28 h-36 opacity-80" />
      <ResumeSvg className="absolute top-[45%] right-[10%] animate-float-2 w-32 h-44 opacity-70" />
      <ResumeSvg className="absolute bottom-[5%] left-[20%] animate-float-3 w-36 h-48 opacity-90 shadow-md" />
      <ResumeSvg className="absolute top-[65%] right-[25%] animate-float-4 w-24 h-32 opacity-60" />
      <ResumeSvg className="absolute top-[15%] right-[35%] animate-float-5 w-28 h-36 opacity-80" />
      
      {/* Added more resumes */}
      <ResumeSvg className="absolute bottom-[25%] right-[5%] animate-float-1 w-24 h-32 opacity-60" style={{ animationDelay: '-15s' }} />
      <ResumeSvg className="absolute top-[30%] left-[25%] animate-float-3 w-28 h-40 opacity-70 shadow-md" style={{ animationDelay: '-8s' }} />
      <ResumeSvg className="absolute bottom-[10%] left-[65%] animate-float-2 w-32 h-44 opacity-80" style={{ animationDelay: '-22s' }} />
      <ResumeSvg className="absolute top-[5%] right-[50%] animate-float-4 w-20 h-28 opacity-90 shadow-sm" style={{ animationDelay: '-12s' }} />
    </div>
  );
};

export default FloatingResumes;
