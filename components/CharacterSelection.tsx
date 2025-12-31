
import React from 'react';
import { ALL_PLAYABLE_MONSTERS, TYPE_COLORS } from '../constants';
import { Monster } from '../types';

interface CharacterSelectionProps {
  onSelect: (monster: Monster) => void;
  unlockedIds: string[];
  monsterStats: Record<string, any>;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect, unlockedIds, monsterStats }) => {
  return (
    <div className="flex flex-col items-center w-full px-4">
      <h2 className="text-5xl font-horror text-white mb-12 tracking-widest">GUARD THE ABYSS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {ALL_PLAYABLE_MONSTERS.map((monster) => {
          const isUnlocked = unlockedIds.includes(monster.id);
          const stats = monsterStats[monster.id] || { level: 1, xp: 0 };
          const nextXp = stats.level * 100;
          
          return (
            <div 
              key={monster.id}
              onClick={() => isUnlocked && onSelect(monster)}
              className={`group relative flex flex-col bg-slate-900/60 border-2 rounded-[2.5rem] p-6 transition-all duration-500 overflow-hidden ${
                isUnlocked 
                ? 'border-indigo-900/50 hover:border-indigo-400 cursor-pointer hover:-translate-y-2' 
                : 'border-slate-800 grayscale opacity-40 cursor-not-allowed'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-slate-700 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <p className="font-horror text-xl text-slate-500">LOCKED</p>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {monster.types.map(t => (
                    <span key={t} className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${TYPE_COLORS[t]}`}>
                      {t}
                    </span>
                  ))}
                </div>
                {isUnlocked && (
                  <span className="text-indigo-400 font-mono font-bold text-sm">LVL {stats.level}</span>
                )}
              </div>

              <div className="relative aspect-square mb-4 rounded-3xl overflow-hidden bg-black/40 border border-white/5">
                <img src={monster.sprite} alt={monster.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              <h3 className="text-2xl font-horror text-white mb-4 group-hover:text-indigo-300 transition-colors">{monster.name}</h3>
              
              {isUnlocked && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>Experience</span>
                      <span>{stats.xp} / {nextXp}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(stats.xp/nextXp)*100}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelection;
