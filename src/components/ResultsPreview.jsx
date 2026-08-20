import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, ListChecks, FileText, Briefcase, AlertCircle } from 'lucide-react';

export default function ResultsPreview({ result, error, onRestart, onRetry }) {
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] animate-fade-in px-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">We couldn't complete the analysis</h2>
          <p className="text-gray-500 text-sm mb-6">{error || 'Please try again.'}</p>
          <button
            onClick={onRetry || onRestart}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const {
    desiredJob = '',
    matchScore = 0,
    summary = '',
    requiredSkills = [],
    matchedSkills = [],
    missingSkills = [],
    explanation = '',
    evidence = [],
    recommendedRoles = []
  } = result;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] animate-fade-in font-sans pb-16 pt-8">
      <div className="w-full max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
            Your screening results
          </h1>
          {desiredJob && (
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100">
              <Briefcase className="w-4 h-4 mr-1.5" />
              Desired role: <span className="font-semibold ml-1">{desiredJob}</span>
            </div>
          )}
        </div>

        {/* 1. MATCH SCORE (Strongest Visual Element) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 mb-8 text-center flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-100 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="text-teal-500 stroke-current drop-shadow-sm transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${251.2 * (matchScore / 100)} 251.2`}
              />
            </svg>
            <div className="absolute text-4xl font-bold text-gray-900">
              {matchScore}<span className="text-2xl text-gray-400">%</span>
            </div>
          </div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">MATCH SCORE</div>
          <div className="text-lg md:text-xl font-medium text-teal-700 bg-teal-50 px-5 py-1.5 rounded-full inline-block border border-teal-100">
            {summary || (matchScore >= 80 ? 'Strong match for this role' : matchScore >= 60 ? 'Good match for this role' : 'Partial match for this role')}
          </div>
        </div>

        {/* 2. WHY THIS MATCH? (AI EXPLANATION) */}
        {explanation && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why this match?</h3>
            <p className="text-gray-600 leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* 3, 4, 5. SKILLS BREAKDOWN */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Required Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm md:text-base">
              <ListChecks className="w-4 h-4 text-gray-500 mr-2" />
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Found */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm md:text-base">
              <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
              Skills Found
            </h3>
            <ul className="space-y-2">
              {matchedSkills.map((skill, i) => (
                <li key={i} className="flex items-center text-sm">
                  <span className="text-teal-500 font-bold mr-2">✓</span>
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Missing */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm md:text-base">
              <XCircle className="w-4 h-4 text-red-500 mr-2" />
              Skills Missing
            </h3>
            <ul className="space-y-2">
              {missingSkills.map((skill, i) => (
                <li key={i} className="flex items-center text-sm">
                  <span className="text-red-500 font-bold mr-2">✕</span>
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. EVIDENCE SECTION */}
        {evidence && evidence.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 text-teal-600 mr-2" />
              Evidence
            </h3>
            <div className="space-y-3">
              {evidence.map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700">
                  {typeof item === 'string' ? (
                    <p className="italic">"{item}"</p>
                  ) : (
                    <div>
                      {item.skill && (
                        <span className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded mb-1.5">
                          {item.skill}
                        </span>
                      )}
                      <p className="italic">"{item.text || item.evidence}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. RECOMMENDED JOB ROLES (Second Major Section) */}
        {recommendedRoles && recommendedRoles.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Where else could you fit?</h2>
              <p className="text-gray-500 text-sm mt-1">Based on the skills identified in your resume.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {recommendedRoles.map((role, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-all">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{role.title}</h4>
                    <div className="text-sm font-medium text-teal-600 mb-3">
                      {role.matchScore}% match
                    </div>
                    <div className="text-xs text-gray-500 mb-4 flex flex-wrap gap-1">
                      {role.skills?.map((s, idx) => (
                        <span key={idx} className="bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center mt-2 group">
                    View role <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start over action */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={onRestart}
            className="text-gray-500 hover:text-gray-800 font-medium transition-colors text-sm"
          >
            ← Start over
          </button>
        </div>
      </div>
    </div>
  );
}
