
import React from 'react';
import { Monster } from '../types';

interface VoidAltarProps {
  essence: number;
  monster: Monster;
  onContinue: () => void;
  onUpgrade: (type: 'hp' | 'mana', cost: number, value: number) => void;
}

const VoidAltar: React.FC<VoidAltarProps> = ({ essence, monster, onContinue, onUpgrade }) => {
  const hpCost = 50;
  const manaCost = 50;

  return (
    <div className="flex flex-col items-center justify-center flex-grow space-y-8 animate-in fade-in duration-700">
      <h2 className="text-6xl font-horror text-indigo-400">VOID ALTAR</h2>
      <p className="text-slate-400 font-mono uppercase tracking-[0.2em]">Soul Essence: <span className="text-cyan-400">{essence}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* HP Upgrade */}
        <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-indigo-900/50 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center text-3xl mb-4">❤️</div>
          <h3 className="text-xl font-bold mb-2">INFUSE VITALITY</h3>
          <p className="text-slate-500 text-sm mb-6">+20 Max Essence (HP)</p>
          <button 
            disabled={essence < hpCost}
            onClick={() => onUpgrade('hp', hpCost, 20)}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${essence >= hpCost ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
          >
            COST: {hpCost}
          </button>
        </div>

        {/* Mana Upgrade */}
        <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-indigo-900/50 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center text-3xl mb-4">🌀</div>
          <h3 className="text-xl font-bold mb-2">INFUSE FOCUS</h3>
          <p className="text-slate-500 text-sm mb-6">+20 Max Mana</p>
          <button 
            disabled={essence < manaCost}
            onClick={() => onUpgrade('mana', manaCost, 20)}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${essence >= manaCost ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
          >
            COST: {manaCost}
          </button>
        </div>
      </div>

      <button 
        onClick={onContinue}
        className="px-20 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-horror text-2xl rounded-full transition-all shadow-lg hover:shadow-indigo-500/20"
      >
        DESCEND DEEPER
      </button>
    </div>
  );
};

export default VoidAltar;
