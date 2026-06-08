import React, { useState, useEffect } from 'react';
import { Camera, ImageUp } from 'lucide-react';

interface SubmitRecipeOcrCardProps {
  onFileSelect: (files: File[]) => void;
  t: any;
}

const SubmitRecipeOcrCard: React.FC<SubmitRecipeOcrCardProps> = ({ onFileSelect, t }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (filesArray.length > 0) {
        onFileSelect(filesArray.slice(0, 2)); // Accept max 2 files
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      if (filesArray.length > 0) {
        onFileSelect(filesArray.slice(0, 2));
      }
    }
  };

  // Add global paste listener (Ctrl+V) when hovering the card
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const filesArray = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (filesArray.length > 0) {
          onFileSelect(filesArray.slice(0, 2));
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onFileSelect]);

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`group relative bg-wurm-panel rounded border transition-all duration-300 cursor-pointer overflow-hidden shadow-black shadow-lg flex flex-col justify-between h-full min-h-[160px] ${
        isDragActive
          ? 'border-wurm-accent bg-wurm-accent/5 scale-[1.01]'
          : 'border-wurm-border hover:border-wurm-accent/40'
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-20"
        title=""
      />

      <div className="absolute inset-y-0 left-0 w-0.5 bg-wurm-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Floating scanner effect on drag active */}
      {isDragActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-wurm-accent shadow-[0_0_8px_#d4b483] animate-[bounce_2s_infinite] pointer-events-none" />
      )}

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-wurm-border/50">
            <Camera size={16} className="text-wurm-accent animate-[pulse_2s_infinite]" />
            <h3 className="text-xs font-bold text-wurm-accent uppercase tracking-widest font-serif">
              {t.forms.ocrSubmitCardTitle}
            </h3>
          </div>
          <p className="text-[10px] text-wurm-muted font-mono leading-relaxed mt-1">
            // {t.forms.ocrSubmitCardDesc}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-wurm-accent group-hover:text-white transition-colors">
          <ImageUp size={14} />
          <span>[ {isDragActive ? 'DROP HERE' : 'UPLOAD / PASTE'} ]</span>
        </div>
      </div>
    </div>
  );
};

export default SubmitRecipeOcrCard;
