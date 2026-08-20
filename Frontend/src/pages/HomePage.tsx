import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAnalysisStore } from '../store/analysisStore';
import Button from '../components/shared/Button';
import ResumeDropzone from '../components/upload/ResumeDropzone';
import JobDescriptionDropzone from '../components/job/JobDescriptionDropzone';

const HomePage = () => {
  const navigate = useNavigate();
  const { file, jdFile } = useAnalysisStore();

  const canAnalyze = file && jdFile;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    // Navigate immediately to ResultsPage which will handle the processing animation
    navigate('/results');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
      
      <div className="mb-4 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="text-text-secondary">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
        </Button>
      </div>

      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        <h1 className="text-[40px] md:text-[48px] font-bold text-text-primary leading-tight mb-4 tracking-tight">
          Turn resumes into <br className="hidden md:block"/> evidence-backed hiring insights.
        </h1>
        <p className="text-text-secondary text-[17px] max-w-2xl mx-auto leading-relaxed">
          Upload a resume and a target job description. <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-emerald text-lg">Hire Lens</span> extracts structured candidate data, verifies every field against source evidence, and generates a ranked fit report.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[500px] -translate-y-2 relative z-20">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-both shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 rounded-[18px]">
          <ResumeDropzone />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 rounded-[18px]">
          <JobDescriptionDropzone />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both relative z-20">
        {/* Validation Checklist */}
        <div className="flex gap-6 mb-6 text-[13px] font-medium justify-center flex-wrap">
          <span className={`flex items-center gap-2 ${file ? 'text-brand-emerald' : 'text-text-muted'}`}>
            <span className={`w-2 h-2 rounded-full ${file ? 'bg-brand-emerald' : 'bg-text-muted/30'}`}></span>
            Resume selected
          </span>
          <span className={`flex items-center gap-2 ${jdFile ? 'text-brand-emerald' : 'text-text-muted'}`}>
            <span className={`w-2 h-2 rounded-full ${jdFile ? 'bg-brand-emerald' : 'bg-text-muted/30'}`}></span>
            Job description uploaded
          </span>
        </div>

        <Button 
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          size="lg"
          variant="primary"
          className="w-full max-w-[340px] text-lg h-16 shadow-[0_6px_0_#1e40af] hover:shadow-[0_8px_0_#1e40af] hover:-translate-y-[2px] active:shadow-[0_2px_0_#1e40af] active:translate-y-[4px] transition-all duration-150"
        >
          Analyze Documents <ArrowRight className="w-5 h-5 ml-1" />
        </Button>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-muted">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-emerald" /> Evidence-Backed</span>
          <span>&middot;</span>
          <span>Secure & Private</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
