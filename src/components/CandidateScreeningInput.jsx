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
    <div className="space-y-10">
      {/* SECTION 01 — RESUME */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="mb-5">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
            01 — Your Resume
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mt-3">Upload your resume</h3>
          <p className="text-sm text-gray-500 mt-1">Your resume helps the AI understand your skills and experience.</p>
        </div>

        <ResumeUploader
          file={resume}
          onUpload={onResumeUpload}
          onClear={onResumeClear}
        />
      </section>

      {/* SECTION 02 — JOB DESCRIPTION */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="mb-5">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
            02 — Job Description
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mt-3">Add the job description</h3>
          <p className="text-sm text-gray-500 mt-1">Give us the requirements so the AI can compare your resume against them.</p>
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
