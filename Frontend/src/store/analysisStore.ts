import { create } from 'zustand';
import type { AnalysisResult } from '../services/api/resumeApi';

export type ProcessingStageId = 'extract' | 'segment' | 'parse' | 'verify' | 'match' | 'report';

export interface ProcessingStage {
  id: ProcessingStageId;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface AnalysisState {
  // Input State
  file: File | null;
  jdFile: File | null;
  
  // Pipeline State
  state: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  processingStages: ProcessingStage[];
  
  // Output State
  result: AnalysisResult | null;
  error: string | null;

  // Actions
  setFile: (file: File | null) => void;
  setJdFile: (file: File | null) => void;
  startAnalysis: () => void;
  updateProcessingStage: (stageId: ProcessingStageId, status: ProcessingStage['status']) => void;
  setCompleted: (result: AnalysisResult) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialStages: ProcessingStage[] = [
  { id: 'extract', label: 'Extracting raw text from documents', status: 'pending' },
  { id: 'segment', label: 'Segmenting into semantic sections', status: 'pending' },
  { id: 'parse', label: 'Parsing structured candidate fields', status: 'pending' },
  { id: 'verify', label: 'Verifying fields against source evidence', status: 'pending' },
  { id: 'match', label: 'Comparing profile against job description', status: 'pending' },
  { id: 'report', label: 'Generating ranked fit report', status: 'pending' },
];

export const useAnalysisStore = create<AnalysisState>((set) => ({
  file: null,
  jdFile: null,
  state: 'IDLE',
  processingStages: initialStages,
  result: null,
  error: null,

  setFile: (file) => set({ file }),
  
  setJdFile: (file) => set({ jdFile: file }),

  startAnalysis: () => set({ 
    state: 'PROCESSING', 
    error: null,
    processingStages: initialStages.map(s => ({ ...s, status: 'pending' }))
  }),

  updateProcessingStage: (stageId, status) => set((state) => ({
    processingStages: state.processingStages.map(stage => 
      stage.id === stageId ? { ...stage, status } : stage
    )
  })),

  setCompleted: (result) => set({ 
    state: 'COMPLETED', 
    result 
  }),

  setError: (error) => set({ state: 'ERROR', error }),

  reset: () => set({
    file: null,
    jdFile: null,
    state: 'IDLE',
    processingStages: initialStages,
    result: null,
    error: null
  })
}));
