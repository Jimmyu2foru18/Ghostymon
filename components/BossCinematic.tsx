
import React, { useState, useEffect } from 'react';
import { Monster } from '../types';
import { generateBossIntro } from '../services/geminiService';

interface BossCinematicProps {
  boss: Monster;
  level: number;
  onComplete: () => void;
}

const BossCinematic: React.FC<BossCinematicProps> = ({ boss, level, onComplete }) => {
  const [intro, setIntro] = useState<string>("The air grows cold as a powerful presence approaches...");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    generateBossIntro(boss.name, level).then(setIntro);
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, [boss.name, level]);

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic Letterboxing */}
      <div className="absolute top-0 left-0 w-full h-24 bg-black z-10 border-b border-indigo-900/30"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-black z-10 border-t border-indigo-900/30"></div>

      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-rose-900/20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(49,46,129,0.15)_0%,transparent_70%)] animate-slow-spin"></div>
      </div>

      {/* Boss Showcase */}
      <div className="relative z-20 flex flex-col items-center max-w-4xl px-6 text-center">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-[80px] animate-pulse"></div>
          <img 
            src={boss.sprite} 
            alt={boss.name} 
            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-[4rem] border-4 border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.4)] animate-in zoom-in-50 duration-1000"
          />
        </div>

        <h2 className="text-xl md:text-2xl font-mono text-indigo-400 tracking-[0.5em] uppercase mb-2 animate-in slide-in-from-top-4 duration-700">
          BOSS ENCOUNTER: LEVEL {level}
        </h2>
        <h1 className="text-6xl md:text-8xl font-horror text-white mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-in slide-in-from-bottom-4 duration-700 delay-200">
          {boss.name}
        </h1>

        <div className="h-24 md:h-32 flex items-center justify-center">
          <p className="text-xl md:text-2xl text-slate-300 italic font-serif leading-relaxed animate-in fade-in duration-1000 delay-500">
            "{intro}"
          </p>
        </div>

        <div className={`mt-12 transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={onComplete}
            className="group relative px-16 py-5 bg-white/5 border border-white/20 hover:border-indigo-500 hover:bg-indigo-600/20 text-white font-horror text-3xl rounded-full transition-all active:scale-95"
          >
            <span className="relative z-10">ACCEPT CHALLENGE</span>
            <div className="absolute inset-0 rounded-full bg-indigo-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-slow-spin { animation: slow-spin 30s linear infinite; }
      `}</style>
    </div>
  );
};

export default BossCinematic;
