import React, { useState } from 'react';
import QuestionLayout from './components/QuestionLayout';
import CandidateScreeningInput from './components/CandidateScreeningInput';
import ReviewCard from './components/ReviewCard';
import LoadingScreen from './components/LoadingScreen';
import ResultsPreview from './components/ResultsPreview';

// Ambient Background Glow, Particles, and Floating Papers (Welcome Page Only)
const WelcomeBackground = () => {
  // Config for 7 background papers with varied sizes, positions, delays, and animation classes
  const papersConfig = [
    { id: 1, top: '12%', left: '6%', w: '44px', h: '58px', delay: '0s', anim: 'welcome-paper-1' },
    { id: 2, top: '22%', right: '8%', w: '52px', h: '68px', delay: '3s', anim: 'welcome-paper-2' },
    { id: 3, top: '65%', left: '4%', w: '40px', h: '52px', delay: '6s', anim: 'welcome-paper-3' },
    { id: 4, top: '55%', right: '5%', w: '48px', h: '62px', delay: '1s', anim: 'welcome-paper-4' },
    { id: 5, top: '35%', left: '15%', w: '38px', h: '50px', delay: '8s', anim: 'welcome-paper-2' },
    { id: 6, top: '75%', right: '14%', w: '46px', h: '60px', delay: '4s', anim: 'welcome-paper-1' },
    { id: 7, top: '82%', left: '9%', w: '42px', h: '55px', delay: '10s', anim: 'welcome-paper-3' },
  ];

  // Config for 12 edge particles with varied positions, sizes, and pulse durations
  const particlesConfig = [
    { id: 1, top: '10%', left: '15%', size: '6px', duration: '5s' },
    { id: 2, top: '15%', right: '20%', size: '8px', duration: '7s' },
    { id: 3, top: '45%', left: '8%', size: '5px', duration: '6s' },
    { id: 4, top: '50%', right: '10%', size: '7px', duration: '8s' },
    { id: 5, top: '80%', left: '18%', size: '8px', duration: '9s' },
    { id: 6, top: '85%', right: '22%', size: '6px', duration: '6s' },
    { id: 7, top: '25%', left: '5%', size: '6px', duration: '7.5s' },
    { id: 8, top: '30%', right: '3%', size: '5px', duration: '5.5s' },
    { id: 9, top: '70%', left: '3%', size: '7px', duration: '8.5s' },
    { id: 10, top: '75%', right: '6%', size: '8px', duration: '6.5s' },
    { id: 11, top: '5%', left: '45%', size: '5px', duration: '7s' },
    { id: 12, top: '92%', right: '45%', size: '6px', duration: '8s' },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Radial Soft Teal/Mint Glow behind card */}
      <div className="welcome-bg-glow"></div>

      {/* Floating Papers */}
      {papersConfig.map((p) => (
        <div
          key={`paper-${p.id}`}
          className={`welcome-paper ${p.anim}`}
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.w,
            height: p.h,
            animationDelay: p.delay,
          }}
        >
          {/* Micro-layout design inside simplified resume paper */}
          <div className="w-full h-full p-1.5 flex flex-col gap-1 relative overflow-hidden">
            {/* Header row with tiny teal accent */}
            <div className="flex justify-between items-center">
              <div className="w-4 h-1.5 bg-[#087F73]/20 rounded-xs"></div>
              <div className="w-1.5 h-1.5 bg-[#087F73]/50 rounded-full"></div>
            </div>
            {/* Body lines */}
            <div className="w-full h-0.5 bg-gray-100 rounded-full"></div>
            <div className="w-11/12 h-0.5 bg-gray-100 rounded-full"></div>
            <div className="w-5/6 h-0.5 bg-gray-100 rounded-full"></div>
            <div className="w-4/5 h-0.5 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      ))}

      {/* Edge Particles */}
      {particlesConfig.map((pt) => (
        <div
          key={`particle-${pt.id}`}
          className="welcome-particle opacity-20"
          style={{
            top: pt.top,
            left: pt.left,
            right: pt.right,
            width: pt.size,
            height: pt.size,
            animationDuration: pt.duration,
          }}
        />
      ))}
    </div>
  );
};

// Premium SVG Illustration of floating resume papers with active micro animations
const ResumeIllustration = () => (
  <div className="relative w-48 h-40 mx-auto mb-6 flex items-center justify-center welcome-ill-float">
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
        
        {/* Verification Checkmark Badge with continuous pulse animation */}
        <div className="welcome-checkmark-pulse absolute -bottom-2 -right-2 w-7 h-7 bg-[#087F73] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>

    {/* Sparkle Icons with slow fade, rotate and pulse animations */}
    <div className="welcome-sparkle-loop absolute top-0 right-4 w-5 h-5 text-teal-400 opacity-60 select-none pointer-events-none">
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
    </div>
    {/* Additional tiny sparkle */}
    <div className="welcome-sparkle-loop absolute bottom-4 left-6 w-3 h-3 text-teal-300 opacity-50 select-none pointer-events-none" style={{ animationDelay: '1.5s' }}>
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
    </div>
    <div className="welcome-sparkle-loop absolute bottom-2 left-4 w-3.5 h-3.5 text-amber-400 opacity-80 select-none pointer-events-none" style={{ animationDelay: '0.8s' }}>
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
    <div className="min-h-screen bg-[#F8FBFA] relative">
      {/* Render Welcome Background animations ONLY on step 0 */}
      {currentStep === 0 && <WelcomeBackground />}

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
            {/* Illustration with entry stagger */}
            <div className="welcome-ill-enter">
              <ResumeIllustration />
            </div>
            <h1 className="text-3xl md:text-[36px] font-bold text-[#10202B] leading-tight tracking-tight mb-4 welcome-heading-enter">
              Let's find your best match.
            </h1>
            <div className="w-12 h-[3px] bg-[#087F73] mx-auto mb-5 rounded-full welcome-subtitle-enter"></div>
            <p className="text-[#6B7780] text-[16px] md:text-[17px] leading-relaxed max-w-md mx-auto welcome-subtitle-enter">
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
