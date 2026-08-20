import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { ExtractedField } from '../../services/api/resumeApi';
import Button from '../shared/Button';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  field: ExtractedField | null;
}

const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ isOpen, onClose, field }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-border ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-secondary">
            <h2 className="text-xl font-bold text-text-primary">Evidence Explorer</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="!px-2 h-8 w-8 rounded-full">
              <X className="w-5 h-5 text-text-muted" />
            </Button>
          </div>
          
          {field ? (
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="mb-8">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">Extracted Field</span>
                <h3 className="text-[22px] font-semibold text-text-primary">{field.category}</h3>
                
                <div className="mt-4 flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    field.status === 'FOUND' ? 'bg-brand-emerald-light text-brand-emerald border border-brand-emerald/20' :
                    field.status === 'NOT_FOUND' ? 'bg-brand-red-light text-brand-red border border-brand-red/20' :
                    'bg-brand-amber-light text-brand-amber border border-brand-amber/20'
                  }`}>
                    {field.status.replace('_', ' ')}
                  </span>
                  {field.source_section && (
                    <span className="text-sm font-medium text-text-secondary bg-surface-secondary px-2.5 py-1 rounded-md border border-border">
                      Section: {field.source_section}
                    </span>
                  )}
                </div>
              </div>

              {field.status === 'FOUND' && field.evidence ? (
                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-3">Source Evidence</span>
                  <div className="bg-[#f8fafc] border border-border rounded-xl p-5 relative font-mono text-sm leading-relaxed text-text-primary shadow-inner">
                    {/* Simulated text highlighting to show exactly what was found */}
                    <div className="whitespace-pre-wrap">
                      {field.evidence}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-text-muted flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> This text was extracted verbatim from the original resume.
                  </p>
                </div>
              ) : field.status === 'NOT_FOUND' ? (
                <div className="bg-surface-secondary border border-border rounded-xl p-6 text-center">
                  <p className="text-[15px] font-medium text-text-secondary">No evidence found in resume.</p>
                  <p className="text-sm text-text-muted mt-2">The parser could not locate information matching this field category.</p>
                </div>
              ) : (
                <div className="bg-surface-secondary border border-border rounded-xl p-6 text-center">
                  <p className="text-[15px] font-medium text-text-secondary">Evidence needs review.</p>
                  <p className="text-sm text-text-muted mt-2">{field.evidence || 'The extracted text was ambiguous or unclear.'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 p-6 flex items-center justify-center text-text-muted">
              Select a field to view evidence.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EvidenceDrawer;
