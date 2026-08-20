import React, { useState } from 'react';
import QuestionLayout from './components/QuestionLayout';
import CandidateScreeningInput from './components/CandidateScreeningInput';
import ReviewCard from './components/ReviewCard';
import LoadingScreen from './components/LoadingScreen';
import ResultsPreview from './components/ResultsPreview';

// Premium SVG Illustration of floating resume papers
const ResumeIllustration = () => (
  <div className="relative w-48 h-40 mx-auto mb-6 flex items-center justify-center">
    {/* Floating Job Description Page */}
    <div className="absolute top-2 left-8 w-24 h-32 bg-white border border-[#DDE8E5] rounded-xl shadow-xs -rotate-12 transform origin-bottom-left pointer-events-none select-none">
      <div className="p-3 space-y-2">
        <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[10px] text-[#087F73] font-bold">JD</div>
        <div className="w-full h-1 bg-gray-100 rounded"></div>
        <div className="w-11/12 h-1 bg-gray-100 rounded"></div>
        <div className="w-5/6 h-1 bg-gray-100 rounded"></div>
      </div>
    </div>
    
    {/* Floating Resume Page (Elevated) */}
    <div className="absolute top-4 right-8 w-24 h-32 bg-white border border-[#DDE8E5] rounded-xl shadow-md rotate-12 transform origin-bottom-right pointer-events-none select-none z-10">
      <div className="p-3 space-y-2 relative">
        <div className="w-6 h-6 rounded-lg bg-[#EAF7F4] flex items-center justify-center text-[10px] text-[#087F73] font-bold">CV</div>
        <div className="w-full h-1 bg-gray-100 rounded"></div>
        <div className="w-full h-1 bg-gray-100 rounded"></div>
        <div className="w-4/5 h-1 bg-[#087F73]/20 rounded"></div>
        
        {/* Verification Checkmark Badge */}
        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#087F73] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>

    {/* Sparkle Icons */}
    <div className="absolute top-0 right-4 w-5 h-5 text-teal-400 opacity-60 animate-pulse select-none pointer-events-none">
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
    </div>
    <div className="absolute bottom-2 left-4 w-3.5 h-3.5 text-amber-400 opacity-80 select-none pointer-events-none">
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
    </div>
  </div>
);

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [candidateData, setCandidateData] = useState({
    resume: null,
    jobDescriptionFile: null,
    jobDescriptionText: ''
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 2; // Step 1: Input, Step 2: Review

  const updateData = (field, value) => {
    setCandidateData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Validation helpers
  const isResumeValid = candidateData.resume !== null;
  const isJdValid = candidateData.jobDescriptionFile !== null || candidateData.jobDescriptionText.trim().length >= 10;
  const isInputComplete = isResumeValid && isJdValid;

  const getValidationMessage = () => {
    if (!isResumeValid) return "Upload your resume to continue.";
    if (!isJdValid) return "Add a job description to continue.";
    return "";
  };

  // Isolated API handoff function
  const analyzeCandidate = async (payload) => {
    console.log("Sending payload to AI Screening Engine:", payload);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          matchScore: 87,
          summary: "Strong match for this role.",
          requiredSkills: [
            "Python", "SQL", "REST APIs", "Git", "AWS", "Docker"
          ],
          matchedSkills: [
            "Python", "SQL", "REST APIs", "Git", "Docker"
          ],
          missingSkills: [
            "AWS"
          ],
          explanation: "The resume demonstrates strong experience with Python, SQL and REST APIs, which directly align with the job requirements.",
          evidence: [
            {
              skill: "Python & REST APIs",
              text: "Developed scalable REST APIs using Python and PostgreSQL."
            },
            {
              skill: "Git & Docker",
              text: "Containerized applications with Docker and managed source code using Git."
            }
          ],
          recommendedRoles: [
            {
              title: "Software Developer",
              matchScore: 92,
              skills: ["Python", "Java", "Git", "Docker"]
            },
            {
              title: "Backend Developer",
              matchScore: 86,
              skills: ["Python", "SQL", "APIs", "Docker"]
            },
            {
              title: "Full Stack Developer",
              matchScore: 78,
              skills: ["React", "Python", "SQL"]
            }
          ]
        });
      }, 3500);
    });
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const payload = {
        resume: candidateData.resume,
        jobDescriptionFile: candidateData.jobDescriptionFile,
        jobDescriptionText: candidateData.jobDescriptionText
      };
      
      const result = await analyzeCandidate(payload);
      setAnalysisResult(result);
    } catch (err) {
      setError("We couldn't complete the analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setAnalysisResult(null);
    setError(null);
    setCurrentStep(0);
    setCandidateData({
      resume: null,
      jobDescriptionFile: null,
      jobDescriptionText: ''
    });
  };

  if (analysisResult || error) {
    return (
      <ResultsPreview 
        result={analysisResult} 
        error={error} 
        onRestart={handleRestart}
        onRetry={startAnalysis}
      />
    );
  }

  if (isAnalyzing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F8FBFA]">
      {/* STEP 0: WELCOME */}
      {currentStep === 0 && (
        <QuestionLayout
          currentStep={0}
          totalSteps={totalSteps}
          onContinue={handleNext}
          continueText="Get Started"
          maxWidth="max-w-[580px]"
          isWelcome={true}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <ResumeIllustration />
            <h1 className="text-3xl md:text-[36px] font-bold text-[#10202B] leading-tight tracking-tight mb-4">
              Let's find your best match.
            </h1>
            <div className="w-12 h-[3px] bg-[#087F73] mx-auto mb-5 rounded-full"></div>
            <p className="text-[#6B7780] text-[16px] md:text-[17px] leading-relaxed max-w-md mx-auto">
              Tell us what role you're looking for, upload your resume, and add the job description you want to compare against.
            </p>
          </div>
        </QuestionLayout>
      )}

      {/* STEP 1: CANDIDATE SCREENING INPUT (UNIFIED SCREEN) */}
      {currentStep === 1 && (
        <QuestionLayout
          question="Let's find your best match."
          subtitle="Tell us what role you're looking for, upload your resume, and add the job description you want to compare against."
          currentStep={1}
          totalSteps={totalSteps}
          maxWidth="max-w-4xl"
          onBack={handleBack}
          onContinue={handleNext}
          continueDisabled={!isInputComplete}
          validationMessage={getValidationMessage()}
        >
          <CandidateScreeningInput
            resume={candidateData.resume}
            onResumeUpload={(file) => updateData('resume', file)}
            onResumeClear={() => updateData('resume', null)}
            jdFile={candidateData.jobDescriptionFile}
            jdText={candidateData.jobDescriptionText}
            onJdFileUpload={(file) => updateData('jobDescriptionFile', file)}
            onJdFileClear={() => updateData('jobDescriptionFile', null)}
            onJdTextChange={(val) => updateData('jobDescriptionText', val)}
          />
        </QuestionLayout>
      )}

      {/* STEP 2: REVIEW */}
      {currentStep === 2 && (
        <QuestionLayout
          question="Ready to analyze?"
          subtitle="We'll send your information to the AI screening engine."
          currentStep={2}
          totalSteps={totalSteps}
          maxWidth="max-w-2xl"
          onBack={handleBack}
          onContinue={startAnalysis}
          continueText="Start Analysis"
        >
          <div className="space-y-4">
            <ReviewCard title="RESUME" onEdit={() => setCurrentStep(1)}>
              <div className="flex items-center text-[#087F73] font-semibold">
                <span className="mr-2">✓</span> {candidateData.resume?.name}
              </div>
            </ReviewCard>
            
            <ReviewCard title="JOB DESCRIPTION" onEdit={() => setCurrentStep(1)}>
              {candidateData.jobDescriptionFile ? (
                <div className="flex items-center text-[#087F73] font-semibold">
                  <span className="mr-2">✓</span> {candidateData.jobDescriptionFile.name}
                </div>
              ) : (
                <div className="flex items-center text-[#087F73] font-semibold">
                  <span className="mr-2">✓</span> Job description added ({candidateData.jobDescriptionText.length} characters)
                </div>
              )}
            </ReviewCard>
          </div>
        </QuestionLayout>
      )}
    </div>
  );
}
