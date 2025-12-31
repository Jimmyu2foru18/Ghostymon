
import React, { useEffect, useState } from 'react';
import { AnimationType } from '../types';

interface MoveVisualsProps {
  type: AnimationType;
  target: 'player' | 'enemy';
  onComplete: () => void;
}

const MoveVisuals: React.FC<MoveVisualsProps> = ({ type, target, onComplete }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!active) return null;

  const containerClasses = target === 'enemy' 
    ? 'absolute top-0 left-0 w-1/2 h-full z-40' 
    : 'absolute top-0 right-0 w-1/2 h-full z-40';

  const renderAnimation = () => {
    switch (type) {
      case 'slash':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute w-[2px] h-[300%] bg-white/80 rotate-[30deg] animate-slash-1"></div>
            <div className="absolute w-[2px] h-[300%] bg-white/80 rotate-[-30deg] animate-slash-2"></div>
          </div>
        );
      case 'burst':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 animate-burst"></div>
            <div className="absolute w-8 h-8 rounded-full border-2 border-orange-400 animate-burst-ring"></div>
          </div>
        );
      case 'pulse':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500/50 animate-pulse-wave"></div>
            <div className="absolute w-20 h-20 rounded-full border-4 border-indigo-400/30 animate-pulse-wave-delayed"></div>
          </div>
        );
      case 'barrier':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="w-32 h-32 rounded-full border-4 border-blue-400/40 bg-blue-500/10 animate-barrier-glow"></div>
          </div>
        );
      case 'bolt':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-1 h-32 bg-cyan-400 animate-bolt rotate-45"></div>
            <div className="absolute w-1 h-32 bg-cyan-300 animate-bolt-delayed -rotate-45"></div>
          </div>
        );
      case 'drain':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-full h-full bg-emerald-500/10 animate-drain-screen"></div>
            <div className="w-4 h-4 bg-emerald-400 rounded-full animate-drain-particle"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={containerClasses}>
      {renderAnimation()}
      <style>{`
        @keyframes slash-1 {
          0% { transform: translate(-150%, -150%) rotate(30deg); opacity: 0; }
          20% { opacity: 1; }
          80% { transform: translate(150%, 150%) rotate(30deg); opacity: 1; }
          100% { transform: translate(150%, 150%) rotate(30deg); opacity: 0; }
        }
        @keyframes slash-2 {
          0% { transform: translate(150%, -150%) rotate(-30deg); opacity: 0; }
          20% { opacity: 1; }
          80% { transform: translate(-150%, 150%) rotate(-30deg); opacity: 1; }
          100% { transform: translate(-150%, 150%) rotate(-30deg); opacity: 0; }
        }
        @keyframes burst {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(4); opacity: 1; }
          100% { transform: scale(8); opacity: 0; }
        }
        @keyframes burst-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(12); opacity: 0; }
        }
        @keyframes pulse-wave {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes pulse-wave-delayed {
          0% { transform: scale(0.5); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes barrier-glow {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 0.6; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        @keyframes bolt {
          0% { transform: translateY(-100%) rotate(45deg); opacity: 0; }
          20% { opacity: 1; }
          80% { transform: translateY(100%) rotate(45deg); opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes bolt-delayed {
          0% { transform: translateY(-100%) rotate(-45deg); opacity: 0; }
          30% { opacity: 1; }
          90% { transform: translateY(100%) rotate(-45deg); opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes drain-screen {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes drain-particle {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(10) translate(20px, -20px); opacity: 0; }
        }
        .animate-slash-1 { animation: slash-1 0.4s ease-out forwards; }
        .animate-slash-2 { animation: slash-2 0.4s ease-out 0.1s forwards; }
        .animate-burst { animation: burst 0.5s ease-out forwards; }
        .animate-burst-ring { animation: burst-ring 0.5s ease-out forwards; }
        .animate-pulse-wave { animation: pulse-wave 0.6s ease-out forwards; }
        .animate-pulse-wave-delayed { animation: pulse-wave-delayed 0.6s ease-out 0.2s forwards; }
        .animate-barrier-glow { animation: barrier-glow 0.8s ease-in-out forwards; }
        .animate-bolt { animation: bolt 0.4s linear forwards; }
        .animate-bolt-delayed { animation: bolt-delayed 0.4s linear forwards; }
        .animate-drain-screen { animation: drain-screen 0.6s ease-in-out forwards; }
        .animate-drain-particle { animation: drain-particle 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MoveVisuals;
