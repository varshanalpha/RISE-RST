import React, { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function ResumeUploader({ file, onUpload, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Upload your resume to continue.');
      return;
    }

    const validExtensions = ['pdf', 'docx', 'doc'];
    const ext = selectedFile.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError('Please upload a PDF or DOCX resume.');
      return;
    }

    onUpload(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (file) {
    return (
      <div className="w-full border-2 border-teal-500 bg-teal-50 rounded-xl p-6 flex flex-col items-center justify-center animate-fade-in relative shadow-sm">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 mb-3 shadow-sm">
          <FileText className="w-6 h-6" />
        </div>
        <div className="font-medium text-teal-900 text-base">{file.name}</div>
        <div className="text-sm text-teal-700 mt-1">{formatSize(file.size)}</div>
        <div className="text-sm font-medium text-teal-600 mt-3 flex items-center bg-teal-100/70 px-3 py-1 rounded-full">
          <span className="mr-1">✓</span> Ready
        </div>
        <button 
          onClick={onClear}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Change file
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
          isDragging ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'
        }`}>
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="font-medium text-gray-900 text-base">Drop your resume here</div>
        <div className="text-gray-500 text-sm mt-0.5 mb-3">or choose a file</div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
          PDF or DOCX · 10 MB
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {error && (
        <div className="mt-3 text-red-500 text-sm flex items-center animate-fade-in">
          <span className="bg-red-100 text-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 font-bold">!</span>
          {error}
        </div>
      )}
    </div>
  );
}
