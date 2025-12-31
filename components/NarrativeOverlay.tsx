
import React from 'react';

interface NarrativeOverlayProps {
  message: string;
  onComplete: () => void;
}

const NarrativeOverlay: React.FC<NarrativeOverlayProps> = ({ message, onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8" onClick={onComplete}>
      <div className="max-w-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <p className="text-3xl md:text-4xl text-purple-200 font-horror leading-relaxed italic">
          "{message}"
        </p>
        <p className="text-slate-500 text-sm animate-pulse">Click to continue...</p>
      </div>
    </div>
  );
};

export default NarrativeOverlay;
