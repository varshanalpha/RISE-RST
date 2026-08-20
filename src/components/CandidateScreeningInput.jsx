import React from 'react';
import ResumeUploader from './ResumeUploader';
import JobDescriptionInput from './JobDescriptionInput';

export default function CandidateScreeningInput({
  resume,
  onResumeUpload,
  onResumeClear,
  jdFile,
  jdText,
  onJdFileUpload,
  onJdFileClear,
  onJdTextChange
}) {
  return (
    <div className="space-y-12">
      {/* SECTION 01 — RESUME */}
      <section className="animate-fade-in">
        <div className="mb-6">
          <span className="inline-block text-[11px] font-extrabold text-[#087F73] uppercase tracking-[0.2em] bg-[#EAF7F4] px-3.5 py-1.5 rounded-lg border border-teal-100/50">
            01 — Your Resume
          </span>
          <h3 className="text-xl font-bold text-[#10202B] mt-3 tracking-tight">Upload your resume</h3>
          <p className="text-sm text-[#6B7780] mt-1 leading-relaxed">Your resume helps the AI understand your skills and experience.</p>
        </div>

        <ResumeUploader
          file={resume}
          onUpload={onResumeUpload}
          onClear={onResumeClear}
        />
      </section>

      {/* SECTION 02 — JOB DESCRIPTION */}
      <section className="animate-fade-in border-t border-gray-100 pt-10">
        <div className="mb-6">
          <span className="inline-block text-[11px] font-extrabold text-[#087F73] uppercase tracking-[0.2em] bg-[#EAF7F4] px-3.5 py-1.5 rounded-lg border border-teal-100/50">
            02 — Job Description
          </span>
          <h3 className="text-xl font-bold text-[#10202B] mt-3 tracking-tight">Add the job description</h3>
          <p className="text-sm text-[#6B7780] mt-1 leading-relaxed">Give us the requirements so the AI can compare your resume against them.</p>
        </div>

        <JobDescriptionInput
          jdFile={jdFile}
          jdText={jdText}
          onFileUpload={onJdFileUpload}
          onFileClear={onJdFileClear}
          onTextChange={onJdTextChange}
        />
      </section>
    </div>
  );
}
