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
      setError('File must be smaller than 10MB.');
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
      <div className="w-full border border-[#087F73] bg-[#EAF7F4]/30 rounded-[16px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in relative">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#087F73] shadow-sm border border-[#DDE8E5]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-[#10202B] text-base">{file.name}</div>
            <div className="text-xs text-[#6B7780] mt-0.5">{formatSize(file.size)}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-[#087F73] bg-[#EAF7F4] px-3.5 py-1 rounded-full border border-teal-100 flex items-center gap-1.5">
            <span>✓</span> Ready
          </div>
          <button 
            onClick={onClear}
            className="text-sm text-[#6B7780] hover:text-[#10202B] font-semibold transition-colors bg-white hover:bg-gray-50 border border-[#DDE8E5] px-4 py-2 rounded-xl"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`w-full border-2 border-dashed rounded-[16px] p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-[#087F73] bg-[#EAF7F4]/30 scale-[1.01]' 
            : 'border-[#DDE8E5] hover:border-[#087F73] hover:bg-[#F8FBFA]'
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
          isDragging ? 'bg-[#087F73] text-white' : 'bg-[#EAF7F4] text-[#087F73]'
        }`}>
          <UploadCloud className="w-7 h-7" />
        </div>
        <div className="font-bold text-[#10202B] text-lg">Drop your resume here</div>
        <div className="text-[#6B7780] text-sm mt-0.5 mb-4">or choose a file</div>
        <div className="text-[11px] font-bold text-[#6B7780] tracking-wide uppercase bg-gray-100/80 px-3.5 py-1.5 rounded-full">
          PDF · DOCX · 10 MB
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
        <div className="mt-3 text-red-500 text-sm flex items-center justify-center animate-fade-in font-medium">
          <span className="bg-red-100 text-red-600 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] mr-2 font-bold">!</span>
          {error}
        </div>
      )}
    </div>
  );
}
