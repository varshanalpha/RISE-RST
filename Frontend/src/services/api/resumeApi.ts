import type { ProcessingStageId } from '../../store/analysisStore';

export interface ExtractedField {
  field_id: string;
  category: string;
  value: string;
  evidence: string | null;
  source_section: string | null;
  status: 'FOUND' | 'NOT_FOUND' | 'AMBIGUOUS';
}

export interface FitReportItem {
  requirement: string;
  match_status: 'MATCHED' | 'NOT_MATCHED' | 'AMBIGUOUS';
  evidence_ref: string | null;
  explanation: string;
}

export interface CandidateProfile {
  fields: ExtractedField[];
}

export interface FitReport {
  score: number;
  items: FitReportItem[];
}

export interface AnalysisResult {
  analysis_id: string;
  status: string;
  profile: CandidateProfile;
  fit_report: FitReport;
  sections?: { name: string; found: boolean }[];
}

export const analyzeResumeMock = async (
  resumeFile: File,
  jdFile: File,
  onProgress?: (stage: ProcessingStageId) => void
): Promise<AnalysisResult> => {
  // Simulate network delay and processing stages
  const stages: ProcessingStageId[] = ['extract', 'segment', 'parse', 'verify', 'match', 'report'];
  
  for (const stage of stages) {
    if (onProgress) onProgress(stage);
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  // Return mock result explicitly flagged as DEMO DATA
  return {
    analysis_id: "DEMO-" + Math.random().toString(36).substring(7).toUpperCase(),
    status: "COMPLETED",
    profile: {
      fields: [
        {
          field_id: "FULL-NAME",
          category: "Full Name",
          status: "FOUND",
          value: "Arjun Kumar",
          evidence: "Arjun Kumar\nSan Francisco, CA",
          source_section: "Contact"
        },
        {
          field_id: "SKILLS-LIST",
          category: "Skills List",
          status: "FOUND",
          value: "Python, SQL, TensorFlow, Docker, AWS",
          evidence: "Skills: Python, SQL, TensorFlow, Docker, AWS, Kubernetes",
          source_section: "Skills"
        },
        {
          field_id: "DEGREE",
          category: "Education",
          status: "FOUND",
          value: "B.S. Computer Science",
          evidence: "B.S. Computer Science, University of California",
          source_section: "Education"
        },
        {
          field_id: "PHONE",
          category: "Phone Number",
          status: "NOT_FOUND"
        },
        {
          field_id: "LOCATION",
          category: "Location",
          status: "AMBIGUOUS",
          value: "San Francisco Area",
          evidence: "Willing to relocate to San Francisco",
          source_section: "Summary"
        },
        {
          field_id: 'f5',
          category: 'GitHub Profile',
          status: 'NOT_FOUND',
          value: '',
          evidence: null,
          source_section: null
        }
      ]
    },
    fit_report: {
      score: 87,
      items: [
        {
          requirement: 'Experience with deep learning frameworks like TensorFlow or PyTorch',
          match_status: 'MATCHED',
          explanation: 'Candidate lists 3 years of PyTorch experience and created a custom LLM fine-tuning pipeline.',
          evidence_ref: 'f2'
        },
        {
          requirement: 'Knowledge of containerization and orchestration (Docker, Kubernetes)',
          match_status: 'MATCHED',
          explanation: 'Candidate explicitly mentions Docker and Kubernetes in both skills and recent project experience.',
          evidence_ref: 'f3'
        },
        {
          requirement: 'Cloud infrastructure experience (AWS or GCP)',
          match_status: 'NOT_MATCHED',
          explanation: 'No mention of AWS, GCP, or general cloud infrastructure experience was found in the document.',
          evidence_ref: null
        },
        {
          requirement: "React / Frontend",
          match_status: "NOT_MATCHED",
          explanation: "Required skill was not found in the extracted candidate fields.",
          evidence_ref: null
        }
      ]
    },
    sections: [
      { name: "CONTACT", found: true },
      { name: "EXPERIENCE", found: true },
      { name: "EDUCATION", found: true },
      { name: "SKILLS", found: true },
      { name: "CERTIFICATIONS", found: false }
    ]
  };
};
