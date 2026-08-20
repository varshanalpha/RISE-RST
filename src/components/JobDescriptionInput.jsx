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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Option A — Upload */}
        <div className="md:col-span-5 flex flex-col justify-between bg-white border border-[#DDE8E5] rounded-xl p-5 shadow-xs">
          <div>
            <h4 className="text-[11px] font-bold text-[#6B7780] uppercase tracking-widest mb-4">Option A — Upload</h4>
            {jdFile ? (
              <div className="border border-[#087F73] bg-[#EAF7F4]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center animate-fade-in py-6">
                <FileText className="w-8 h-8 text-[#087F73] mb-2" />
                <div className="font-semibold text-[#10202B] text-sm truncate max-w-full">{jdFile.name}</div>
                <div className="text-xs text-[#6B7780] mt-1">{formatSize(jdFile.size)}</div>
                <div className="text-xs font-bold text-[#087F73] bg-[#EAF7F4] px-2.5 py-1 rounded-full border border-teal-100 mt-3">✓ JD Uploaded</div>
                <button
                  onClick={onFileClear}
                  className="mt-3 text-xs font-semibold text-[#6B7780] hover:text-[#10202B] underline"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center py-8
                  ${isDragging 
                    ? 'border-[#087F73] bg-[#EAF7F4]/30' 
                    : 'border-[#DDE8E5] hover:border-[#087F73] hover:bg-[#F8FBFA]'
                  }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-6 h-6 text-[#6B7780] mb-2" />
                <div className="font-bold text-[#10202B] text-sm">Upload Job Description</div>
                <div className="text-xs text-[#6B7780] mt-1">PDF, DOCX or TXT</div>
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
            <div className="mt-3 text-red-500 text-xs flex items-center justify-center animate-fade-in font-medium">
              <span className="bg-red-100 text-red-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-1.5 font-bold">!</span>
              {error}
            </div>
          )}
        </div>

        {/* OR Divider */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center">
          <span className="text-[11px] font-extrabold text-[#6B7780] uppercase tracking-widest bg-gray-100 px-2.5 py-1.5 rounded-full select-none">OR</span>
        </div>

        {/* Option B — Paste */}
        <div className="md:col-span-6 bg-white border border-[#DDE8E5] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold text-[#6B7780] uppercase tracking-widest mb-4">Option B — Paste</h4>
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
            <div className="mt-3 text-xs font-semibold text-[#087F73] flex items-center bg-[#EAF7F4]/50 border border-teal-100/50 px-3 py-1 rounded-lg w-max">
              <span className="mr-1.5 font-bold">✓</span> Job description added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
