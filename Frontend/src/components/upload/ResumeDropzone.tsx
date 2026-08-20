import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle2, X } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import Button from '../shared/Button';

const ResumeDropzone = () => {
  const { file, setFile } = useAnalysisStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      return false;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      setError('Unsupported file format. Please upload PDF, DOC, or DOCX.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, [setFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="glass-card rounded-[18px] p-6 lg:p-8 h-full flex flex-col transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-primary to-brand-emerald w-0 group-hover:w-full transition-all duration-500 opacity-70"></div>
      
      <div className="mb-6">
        <h3 className="text-[22px] font-bold text-text-primary flex items-center gap-2">
          <span className="text-brand-primary/50 font-mono text-lg">01</span> Upload Resume
        </h3>
        <p className="text-text-muted mt-1 text-[15px]">Provide the candidate resume you want to analyze.</p>
      </div>

      {!file ? (
        <div 
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
            isDragOver 
              ? 'border-brand-primary bg-brand-primary-light scale-[1.01]' 
              : 'border-border bg-surface-secondary hover:border-brand-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 transition-transform duration-300 ${isDragOver ? 'scale-110 -translate-y-2' : ''}`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-brand-primary' : 'text-text-muted'}`} />
          </div>
          <h4 className="text-lg font-semibold mb-1 text-text-primary">
            {isDragOver ? 'Release to upload' : 'Drop resume here'}
          </h4>
          <p className="text-sm text-text-muted mb-6 text-center">or browse from your computer</p>
          
          <div className="relative">
            <input id="resume-upload-input" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <Button variant="secondary" onClick={() => document.getElementById('resume-upload-input')?.click()}>
              Browse Resume
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-text-muted">
            <span className="px-2.5 py-1 bg-white rounded-md border border-border shadow-sm">PDF</span>
            <span className="px-2.5 py-1 bg-white rounded-md border border-border shadow-sm">DOCX</span>
            <span className="ml-2">Max 10 MB</span>
          </div>
          
          {error && <p className="mt-4 text-brand-red text-sm font-medium">{error}</p>}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border border-border bg-surface-secondary rounded-xl p-8 animate-in fade-in slide-in-from-bottom-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary-light flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-brand-primary" />
          </div>
          <h4 className="font-semibold text-text-primary text-center truncate max-w-full mb-1">{file.name}</h4>
          <p className="text-sm text-text-muted mb-4">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          
          <div className="flex items-center gap-2 text-brand-emerald font-medium text-sm mb-6 bg-brand-emerald-light px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            Resume ready for analysis
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <input id="resume-replace-input" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              <Button variant="secondary" size="sm" onClick={() => document.getElementById('resume-replace-input')?.click()}>
                Replace
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-brand-red hover:bg-brand-red-light hover:text-brand-red">
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDropzone;
