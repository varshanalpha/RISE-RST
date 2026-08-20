import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Loader2, ScanSearch, FolderOpen, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '../store/analysisStore';
import { analyzeResumeMock } from '../services/api/resumeApi';
import type { AnalysisResult } from '../services/api/resumeApi';
import Button from '../components/shared/Button';
import ProfileOverview from '../components/candidate/ProfileOverview';
import FitAnalysis from '../components/fit/FitAnalysis';

const VerificationAnimation = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center justify-center">
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 bg-brand-primary/10 blur-[100px] rounded-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* The Folder */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FolderOpen className="w-32 h-32 text-brand-primary drop-shadow-xl" strokeWidth={1} />
        </motion.div>
      </motion.div>

      {/* Flying Resumes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-10 w-12 h-16 bg-white border border-slate-200 rounded shadow-lg flex flex-col p-1 gap-1"
          initial={{ 
            x: (Math.random() - 0.5) * 600, 
            y: (Math.random() - 0.5) * 600, 
            scale: 0, 
            opacity: 0,
            rotate: Math.random() * 90 - 45
          }}
          animate={{ 
            x: 0, 
            y: 0, 
            scale: [0, 1.5, 0], 
            opacity: [0, 1, 0],
            rotate: 0
          }}
          transition={{ 
            duration: 1.5, 
            delay: i * 0.2 + 0.5,
            ease: "easeInOut" 
          }}
        >
          <div className="w-4 h-4 rounded-full bg-slate-200" />
          <div className="w-full h-1 bg-brand-primary/20 rounded" />
          <div className="w-3/4 h-1 bg-slate-200 rounded" />
        </motion.div>
      ))}

      {/* Final Verification Badge */}
      <motion.div
        className="absolute z-30 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.2, type: "spring", bounce: 0.5 }}
      >
        <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-brand-emerald mb-4">
          <ShieldCheck className="w-12 h-12 text-brand-emerald" />
        </div>
        <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border border-border">
          <h3 className="text-xl font-bold text-text-primary">Source Verified</h3>
        </div>
      </motion.div>
    </div>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const { file, jdFile, result, state, processingStages, startAnalysis, updateProcessingStage, setCompleted, reset } = useAnalysisStore();
  
  const [animationPhase, setAnimationPhase] = useState<'analyzing' | 'verifying'>('analyzing');

  useEffect(() => {
    if (state === 'IDLE' && file && jdFile) {
      const runAnalysis = async () => {
        startAnalysis();
        setAnimationPhase('analyzing');
        try {
          const res = await analyzeResumeMock(
            file, 
            jdFile,
            (stageId) => {
              useAnalysisStore.getState().processingStages.forEach(s => {
                if (s.status === 'active') updateProcessingStage(s.id, 'completed');
              });
              updateProcessingStage(stageId, 'active');
            }
          );
          
          useAnalysisStore.getState().processingStages.forEach(s => {
            if (s.status === 'active') updateProcessingStage(s.id, 'completed');
          });
          
          // Switch to verification animation
          setAnimationPhase('verifying');
          
          // Wait for animation to finish before showing results
          setTimeout(() => {
            setCompleted(res);
          }, 3500);
          
        } catch (e) {
          console.error(e);
          navigate('/analyze');
        }
      };
      
      runAnalysis();
    } else if (state === 'IDLE' && (!file || !jdFile)) {
      navigate('/analyze');
    }
  }, [file, jdFile, state, startAnalysis, updateProcessingStage, setCompleted, navigate]);

  const handleStartNew = () => {
    reset();
    navigate('/analyze');
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full">
      <AnimatePresence mode="wait">
        
        {/* PROCESSING VIEW */}
        {state === 'PROCESSING' && animationPhase === 'analyzing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-background z-50 p-6"
          >
            <div className="max-w-xl w-full">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-brand-primary-light rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <ScanSearch className="w-10 h-10 text-brand-primary relative z-10" />
                  <motion.div 
                    className="absolute inset-0 border-2 border-brand-primary rounded-full"
                    animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-0 border-2 border-brand-primary rounded-full"
                    animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </div>
                <h2 className="text-3xl font-extrabold text-text-primary mb-3">Analyzing Documents</h2>
                <p className="text-text-secondary text-lg">Extracting evidence and computing fit scores...</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent w-full h-[30%] animate-[scanLine_2s_ease-in-out_infinite]"></div>
                
                <div className="space-y-6 relative z-10">
                  {processingStages.map((stage) => {
                    const isCompleted = stage.status === 'completed';
                    const isActive = stage.status === 'active';
                    
                    return (
                      <motion.div 
                        key={stage.id} 
                        initial={false}
                        animate={{
                          scale: isActive ? 1.02 : 1,
                          opacity: isCompleted || isActive ? 1 : 0.4
                        }}
                        className={`flex items-center gap-4 transition-colors duration-300 ${
                          isCompleted ? 'text-text-primary' : isActive ? 'text-brand-primary' : 'text-text-muted'
                        }`}
                      >
                        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7 text-brand-emerald" />
                          ) : isActive ? (
                            <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </div>
                        <span className={`text-[16px] font-medium ${isActive ? 'font-bold' : ''}`}>
                          {stage.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VERIFICATION ANIMATION VIEW */}
        {state === 'PROCESSING' && animationPhase === 'verifying' && (
          <motion.div 
            key="verifying"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-background z-50 p-6"
          >
            <VerificationAnimation />
          </motion.div>
        )}

        {/* COMPLETED VIEW */}
        {state === 'COMPLETED' && result && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-[1080px] mx-auto px-4 md:px-6 py-10 relative z-10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-[32px] font-bold text-text-primary leading-tight mb-1">Analysis Results</h1>
                <p className="text-text-secondary flex items-center gap-2">
                  Analysis ID: <span className="font-mono bg-surface-secondary px-2 py-0.5 rounded text-xs border border-border font-medium">{result.analysis_id}</span>
                </p>
              </div>
              
              <Button variant="secondary" onClick={handleStartNew} className="bg-white">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Start New Analysis
              </Button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <ProfileOverview profile={result.profile} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-12"
            >
              <FitAnalysis fitReport={result.fit_report} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-center pb-12"
            >
              <p className="text-sm font-semibold text-text-muted mb-1">Evidence-backed by design</p>
              <p className="text-xs text-text-muted">Missing information is shown as Not Found rather than inferred.</p>
            </motion.div>

          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage;
