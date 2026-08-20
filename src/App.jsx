import React, { useState } from 'react';
import QuestionLayout from './components/QuestionLayout';
import CandidateScreeningInput from './components/CandidateScreeningInput';
import ReviewCard from './components/ReviewCard';
import LoadingScreen from './components/LoadingScreen';
import ResultsPreview from './components/ResultsPreview';

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
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* STEP 0: WELCOME */}
      {currentStep === 0 && (
        <QuestionLayout
          currentStep={0}
          totalSteps={totalSteps}
          onContinue={handleNext}
          continueText="Get Started"
        >
          <div className="flex flex-col items-center justify-center h-full pt-12 md:pt-20 text-center">
            <div className="w-24 h-24 bg-teal-50 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
              <div className="w-12 h-12 bg-teal-600 rounded-xl transform rotate-12 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-5 tracking-tight">
              Let's find your best match.
            </h1>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
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
              <div className="flex items-center text-teal-700 font-medium">
                <span className="mr-2">✓</span> {candidateData.resume?.name}
              </div>
            </ReviewCard>
            
            <ReviewCard title="JOB DESCRIPTION" onEdit={() => setCurrentStep(1)}>
              {candidateData.jobDescriptionFile ? (
                <div className="flex items-center text-teal-700 font-medium">
                  <span className="mr-2">✓</span> {candidateData.jobDescriptionFile.name}
                </div>
              ) : (
                <div className="flex items-center text-teal-700 font-medium">
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
