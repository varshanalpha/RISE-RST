import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2, ShieldCheck, Target } from 'lucide-react';
import Button from '../components/shared/Button';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleGetStarted = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/analyze');
    }, 500); // Shorter, snappier wait
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12 relative z-10 transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 scale-[1.05] blur-md translate-y-[-10px]' : 'opacity-100 scale-100 blur-0 translate-y-0'}`}>
      
      <div className="max-w-4xl w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary-light text-brand-primary font-semibold text-sm mb-8 border border-brand-primary/20">
          <ShieldCheck className="w-4 h-4" />
          Evidence-Backed Resume Intelligence
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight leading-[1.1] mb-6">
          Parse. Verify. <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-emerald">Match.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          The ultimate recruiter intelligence platform. Extract structured data from candidate resumes, verify every claim with source evidence, and generate transparent job fit reports.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 relative">
          {/* Animated glow behind the button */}
          <div className="absolute inset-0 bg-brand-primary/30 blur-xl rounded-full scale-110 animate-pulse"></div>
          
          <Button 
            size="lg" 
            className="relative w-full sm:w-auto min-w-[220px] h-14 text-lg bg-text-primary text-white hover:bg-black shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" 
            onClick={handleGetStarted}
          >
            Get Started <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-brand-primary-light rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Smart Extraction</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Automatically segments and parses resumes into structured fields without hallucinating missing data.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-brand-emerald-light rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-brand-emerald" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Verifiable Evidence</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every extracted fact is linked directly to the verbatim text in the source document.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-brand-violet/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-brand-violet" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Targeted Job Fit</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Instantly analyzes the candidate against your specific job description requirements.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;
