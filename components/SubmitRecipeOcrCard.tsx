import React, { useState, useEffect, useRef } from 'react';
import { Camera, ImageUp, HelpCircle, X } from 'lucide-react';
import correctImg from '../recipe_guide_correct.png';
import incorrectImg from '../recipe_guide_incorrect.png';

interface SubmitRecipeOcrCardProps {
  onFileSelect: (files: File[]) => void;
  t: any;
}

const SubmitRecipeOcrCard: React.FC<SubmitRecipeOcrCardProps> = ({ onFileSelect, t }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

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
    <>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleCardClick}
        className={`group relative bg-wurm-panel rounded border transition-all duration-300 cursor-pointer overflow-hidden shadow-black shadow-lg flex flex-col justify-between h-[170px] ${
          isDragActive
            ? 'border-wurm-accent bg-wurm-accent/5 scale-[1.01]'
            : 'border-wurm-border hover:border-wurm-accent/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="absolute inset-y-0 left-0 w-0.5 bg-wurm-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Floating scanner effect on drag active */}
        {isDragActive && (
          <div className="absolute top-0 left-0 w-full h-1 bg-wurm-accent shadow-[0_0_8px_#d4b483] animate-[bounce_2s_infinite] pointer-events-none" />
        )}

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-wurm-border/50">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-wurm-accent animate-[pulse_2s_infinite]" />
                <h3 className="text-xs font-bold text-wurm-accent uppercase tracking-widest font-serif truncate">
                  {t.forms.ocrSubmitCardTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowHelp(true);
                }}
                className="relative z-30 flex items-center gap-1 text-[9px] font-mono text-wurm-accent hover:text-white transition-colors border border-wurm-accent/30 hover:border-white/40 rounded px-1.5 py-0.5 bg-black/40 cursor-pointer"
              >
                <HelpCircle size={10} />
                <span>{t.forms.ocrHelpLink}</span>
              </button>
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

      {showHelp && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowHelp(false)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
              animation: fadeIn 0.15s ease-out forwards;
            }
          `}</style>
          <div 
            className="bg-wurm-panel border border-wurm-border rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-wurm-text flex flex-col gap-4 font-mono animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-wurm-border/50">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-wurm-accent" />
                <h3 className="text-sm font-bold text-wurm-accent uppercase tracking-widest font-serif">
                  {t.forms.ocrHelpTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-wurm-muted hover:text-white transition-colors cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            <p className="text-[11px] text-wurm-text leading-relaxed bg-black/35 p-3 rounded border border-wurm-border/40">
              {t.forms.ocrHelpDesc}
            </p>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {/* Correct */}
              <div className="border border-green-800/40 bg-green-950/10 rounded-lg p-3 flex flex-col gap-2.5 items-center">
                <div className="flex items-center gap-1.5 bg-green-900/60 text-green-100 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider border border-green-700/30">
                  <span>✓</span>
                  <span>{t.forms.ocrHelpCorrect}</span>
                </div>
                <div className="w-full flex-1 flex items-center justify-center bg-black/45 rounded p-1 border border-wurm-border/30">
                  <img 
                    src={correctImg} 
                    alt={t.forms.ocrHelpCorrect} 
                    className="rounded max-h-[220px] object-contain shadow-md"
                  />
                </div>
              </div>

              {/* Incorrect */}
              <div className="border border-red-900/30 bg-red-950/10 rounded-lg p-3 flex flex-col gap-2.5 items-center">
                <div className="flex items-center gap-1.5 bg-red-900/50 text-red-100 font-bold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider border border-red-800/30">
                  <span>✗</span>
                  <span>{t.forms.ocrHelpIncorrect}</span>
                </div>
                <div className="w-full flex-1 flex items-center justify-center bg-black/45 rounded p-1 border border-wurm-border/30">
                  <img 
                    src={incorrectImg} 
                    alt={t.forms.ocrHelpIncorrect} 
                    className="rounded max-h-[220px] object-contain shadow-md opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="bg-wurm-accent hover:bg-white text-black font-bold px-4 py-1.5 rounded text-[10px] uppercase tracking-widest font-mono transition-colors cursor-pointer"
              >
                {t.forms.ocrHelpClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitRecipeOcrCard;
