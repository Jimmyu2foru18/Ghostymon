
import React from 'react';

interface StatusBarProps {
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  isEnemy?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ name, hp, maxHp, mana, maxMana, isEnemy = false }) => {
  const hpPercent = Math.max(0, (hp / maxHp) * 100);
  const manaPercent = Math.max(0, (mana / maxMana) * 100);
  const hpColor = hpPercent > 60 ? 'from-emerald-600 to-emerald-400' : hpPercent > 30 ? 'from-amber-600 to-amber-400' : 'from-rose-600 to-rose-400';

  return (
    <div className={`w-full flex flex-col gap-2 ${isEnemy ? 'items-start' : 'items-end'} z-20`}>
      <h4 className="text-3xl font-horror tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{name}</h4>
      
      <div className="w-full max-w-[280px] bg-black/60 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
             <span>Essence</span>
             <span className="text-white">{hp}</span>
          </div>
          <div className="relative h-3 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full transition-all duration-700 ease-out bg-gradient-to-r ${hpColor}`} style={{ width: `${hpPercent}%` }}>
               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer"></div>
            </div>
          </div>
        </div>

        <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-700" style={{ width: `${manaPercent}%` }} />
        </div>
      </div>
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
      `}</style>
    </div>
  );
};

export default StatusBar;
