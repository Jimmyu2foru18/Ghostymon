
import React from 'react';

interface GameOverlayProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 overflow-hidden">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-[3rem] p-10 relative animate-in fade-in slide-in-from-bottom-10 duration-500 shadow-2xl flex flex-col max-h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all text-2xl"
        >
          ✕
        </button>
        
        <h2 className="text-5xl font-horror text-indigo-400 mb-8 tracking-widest text-center">{title}</h2>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
          {children}
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all transform hover:scale-105"
          >
            RETURN TO GATEWAY
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #312e81; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default GameOverlay;
