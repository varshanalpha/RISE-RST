import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';
import { FitReport, FitReportItem } from '../../services/api/resumeApi';

interface FitAnalysisProps {
  fitReport: FitReport;
}

const FitAnalysis: React.FC<FitAnalysisProps> = ({ fitReport }) => {
  return (
    <div className="glass-card rounded-[18px] p-6 lg:p-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-border">
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-brand-primary" />
            <h2 className="text-[24px] font-bold text-text-primary">Job Fit Analysis</h2>
          </div>
          <p className="text-text-secondary text-[15px]">Evidence-backed comparison against the target role requirements.</p>
        </div>
        
        {fitReport.score !== undefined && (
          <div className="flex-shrink-0 flex items-center gap-6 bg-surface-secondary border border-border rounded-2xl p-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2563EB" strokeWidth="8" 
                  strokeDasharray={`${(fitReport.score / 100) * 283} 283`}
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[28px] font-bold text-text-primary leading-none">{fitReport.score}%</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary mb-1">
                {fitReport.score >= 80 ? 'Strong Match' : fitReport.score >= 60 ? 'Moderate Match' : 'Weak Match'}
              </div>
              <div className="text-sm text-text-muted font-medium">Overall Fit Score</div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">Requirement Matrix</h3>
        <div className="grid grid-cols-1 gap-3">
          {fitReport.items.map((item, idx) => (
            <div key={idx} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.match_status === 'MATCHED' ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-emerald flex-shrink-0" />
                    ) : item.match_status === 'NOT_MATCHED' ? (
                      <XCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-brand-amber flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-text-primary text-[16px]">{item.requirement}</h4>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      item.match_status === 'MATCHED' ? 'bg-brand-emerald-light text-brand-emerald' :
                      item.match_status === 'NOT_MATCHED' ? 'bg-brand-red-light text-brand-red' :
                      'bg-brand-amber-light text-brand-amber'
                    }`}>
                      {item.match_status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-[14px] text-text-secondary">
                    {item.explanation || (item.match_status === 'NOT_MATCHED' ? 'Not found in the resume.' : '')}
                  </p>
                </div>
                
                {item.evidence_ref && (
                  <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface-secondary border border-border rounded-lg text-[13px] font-semibold text-text-secondary hover:bg-gray-100 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View Evidence
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FitAnalysis;
