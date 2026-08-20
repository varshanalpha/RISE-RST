import React, { useState } from 'react';
import { User, CheckCircle2, XCircle, AlertCircle, Eye, Circle } from 'lucide-react';
import { CandidateProfile, ExtractedField } from '../../services/api/resumeApi';
import EvidenceDrawer from '../evidence/EvidenceDrawer';

interface ProfileOverviewProps {
  profile: CandidateProfile;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile }) => {
  const [selectedField, setSelectedField] = useState<ExtractedField | null>(null);
  
  const foundFields = profile.fields.filter(f => f.status === 'FOUND').length;
  const totalFields = profile.fields.length;
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'FOUND': return <CheckCircle2 className="w-4 h-4 text-brand-emerald" />;
      case 'NOT_FOUND': return <XCircle className="w-4 h-4 text-brand-red" />;
      case 'AMBIGUOUS': return <AlertCircle className="w-4 h-4 text-brand-amber" />;
      default: return <Circle className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <>
      <div className="glass-card rounded-[18px] p-6 lg:p-8 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-brand-primary to-brand-violet transition-all duration-300"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center">
              <User className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-[24px] font-bold text-text-primary">Candidate Profile</h2>
              <p className="text-text-secondary text-[15px]">Structured data extracted from resume</p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center gap-3 px-4 py-2 bg-surface-secondary rounded-xl border border-border">
            <div className="text-sm font-semibold text-text-secondary">Extraction Completeness</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-brand-primary">{foundFields}/{totalFields}</span>
              <span className="text-xs text-text-muted font-medium">FOUND</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-12 text-xs font-bold text-text-muted uppercase tracking-wider px-4 pb-2">
            <div className="col-span-3">Field</div>
            <div className="col-span-5">Extracted Value</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Evidence</div>
          </div>
          
          {profile.fields.map((field) => (
            <div 
              key={field.field_id}
              className="grid grid-cols-12 items-center bg-white border border-border rounded-xl p-4 transition-all hover:border-brand-primary/30 hover:shadow-sm group/row"
            >
              <div className="col-span-3 font-semibold text-[14px] text-text-primary">{field.category}</div>
              <div className="col-span-5 text-[15px] pr-4">
                {field.status === 'NOT_FOUND' ? (
                  <span className="text-text-muted italic">Not found in resume</span>
                ) : field.status === 'AMBIGUOUS' ? (
                  <span className="text-brand-amber font-medium">Needs Review</span>
                ) : (
                  <span className="text-text-secondary">{field.value}</span>
                )}
              </div>
              <div className="col-span-2 flex items-center gap-1.5">
                {getStatusIcon(field.status)}
                <span className={`text-[13px] font-bold ${
                  field.status === 'FOUND' ? 'text-brand-emerald' :
                  field.status === 'NOT_FOUND' ? 'text-brand-red' : 'text-brand-amber'
                }`}>
                  {field.status.replace('_', ' ')}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <button 
                  onClick={() => setSelectedField(field)}
                  className="inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-brand-primary bg-brand-primary-light hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <EvidenceDrawer 
        isOpen={selectedField !== null} 
        onClose={() => setSelectedField(null)} 
        field={selectedField} 
      />
    </>
  );
};

export default ProfileOverview;
