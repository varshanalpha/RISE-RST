import React, { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import TextArea from './TextArea';

export default function JobDescriptionInput({ 
  jdFile, 
  jdText, 
  onFileUpload, 
  onFileClear, 
  onTextChange 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be smaller than 10 MB.');
      return;
    }

    const validExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setError('Please upload a PDF, DOCX or TXT file.');
      return;
    }

    onFileUpload(selectedFile);
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Option A: Upload Job Description */}
        <div className="md:col-span-5 flex flex-col justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Option A — Upload</h4>
            {jdFile ? (
              <div className="border border-teal-500 bg-teal-50 rounded-xl p-4 flex flex-col items-center justify-center text-center animate-fade-in py-6">
                <FileText className="w-8 h-8 text-teal-600 mb-2" />
                <div className="font-medium text-teal-900 text-sm truncate max-w-full">{jdFile.name}</div>
                <div className="text-xs text-teal-700 mt-1">{formatSize(jdFile.size)}</div>
                <div className="text-xs font-medium text-teal-600 mt-2">✓ Job description uploaded</div>
                <button
                  onClick={onFileClear}
                  className="mt-3 text-xs font-medium text-teal-700 hover:text-teal-900 underline"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center py-8
                  ${isDragging 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                  }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                <div className="font-medium text-gray-900 text-sm">Upload Job Description</div>
                <div className="text-xs text-gray-400 mt-1">PDF, DOCX or TXT</div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
          {error && (
            <div className="mt-2 text-red-500 text-xs flex items-center animate-fade-in">
              <span className="bg-red-100 text-red-600 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px] mr-1.5 font-bold">!</span>
              {error}
            </div>
          )}
        </div>

        {/* OR Divider for Mobile / Desktop */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-full">OR</span>
        </div>

        {/* Option B: Paste Job Description */}
        <div className="md:col-span-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Option B — Paste</h4>
            <TextArea
              value={jdText}
              onChange={(val) => {
                if (jdFile && val) onFileClear();
                onTextChange(val);
              }}
              placeholder="Paste the job description here..."
              maxLength={5000}
            />
          </div>
          {jdText.length > 0 && (
            <div className="mt-2 text-xs font-medium text-teal-600 flex items-center">
              <span className="mr-1">✓</span> Job description added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
