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
      className={`group relative bg-black/20 rounded border transition-all duration-300 cursor-pointer overflow-hidden shadow-lg shadow-black/50 h-full min-h-[160px] flex flex-col items-center justify-center text-center p-6 ${
        isDragActive
          ? 'border-wurm-accent bg-wurm-accent/10 scale-[1.02]'
          : 'border-wurm-accent/30 hover:border-wurm-accent hover:bg-wurm-accent/5'
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

      <div className="absolute inset-0 bg-gradient-to-br from-wurm-accent/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Floating scanner effect on drag active */}
      {isDragActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-wurm-accent shadow-[0_0_8px_#d4b483] animate-[bounce_2s_infinite] pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
          isDragActive 
            ? 'bg-wurm-accent text-black scale-110 border-wurm-accent' 
            : 'bg-wurm-accent/10 border-wurm-accent/30 text-wurm-accent group-hover:scale-110 group-hover:bg-wurm-accent group-hover:text-black'
        }`}>
          {isDragActive ? <ImageUp size={22} strokeWidth={1.5} /> : <Camera size={22} strokeWidth={1.5} />}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold font-serif text-wurm-accent uppercase tracking-widest">
            {t.forms.ocrSubmitCardTitle}
          </h3>
          <p className="text-[10px] text-wurm-muted font-mono max-w-[200px] leading-normal">
            // {t.forms.ocrSubmitCardDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitRecipeOcrCard;
