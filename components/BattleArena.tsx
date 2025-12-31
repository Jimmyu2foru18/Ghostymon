
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Monster, Move, BattleLogEntry, AnimationType } from '../types';
import { generateBattleNarrative } from '../services/geminiService';
import { TYPE_COLORS } from '../constants';
import StatusBar from './StatusBar';
import MoveVisuals from './MoveVisuals';

interface BattleArenaProps {
  player: Monster;
  enemy: Monster;
  level: number;
  onVictory: (xp: number, essence: number) => void;
  onDefeat: () => void;
  updatePlayer: (monster: Monster) => void;
  onQuit: () => void;
  onOpenTutorial: () => void;
  isMuted: boolean;
  sfxVolume: number;
}

const BattleArena: React.FC<BattleArenaProps> = ({ player, enemy, level, onVictory, onDefeat, updatePlayer, onQuit, onOpenTutorial, isMuted, sfxVolume }) => {
  const [enemyHp, setEnemyHp] = useState(enemy.currentHp);
  const [enemyMana, setEnemyMana] = useState(enemy.currentMana);
  const [enemyDefense, setEnemyDefense] = useState(enemy.defense);
  
  const [playerHp, setPlayerHp] = useState(player.currentHp);
  const [playerMana, setPlayerMana] = useState(player.currentMana);
  const [playerDefense, setPlayerDefense] = useState(player.defense);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [logs, setLogs] = useState<BattleLogEntry[]>([]);
  const [isActing, setIsActing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animatingPlayer, setAnimatingPlayer] = useState(false);
  const [animatingEnemy, setAnimatingEnemy] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<{ type: AnimationType, target: 'player' | 'enemy' } | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);
  const damageSfx = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    damageSfx.current = new Audio('Damage sound.mp3');
  }, []);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = useCallback((message: string, type: BattleLogEntry['type']) => {
    setLogs(prev => [...prev, { message, type }]);
  }, []);

  const calculateHit = (accuracy: number) => {
    const roll = Math.random() * 100;
    if (roll > accuracy) return 'miss';
    if (roll > accuracy * 0.7) return 'partial';
    return 'full';
  };

  const executeMoveAction = async (attacker: Monster, target: Monster, move: Move, isPlayerAttacking: boolean) => {
    setIsActing(true);
    addLog(`${attacker.name} invokes ${move.name}!`, isPlayerAttacking ? 'player' : 'enemy');
    
    if (isPlayerAttacking) setAnimatingPlayer(true);
    else setAnimatingEnemy(true);
    
    await new Promise(r => setTimeout(r, 400));

    const hitType = calculateHit(move.accuracy);
    if (hitType !== 'miss' && move.animation) {
      setActiveAnimation({ 
        type: move.animation, 
        target: move.isDefensive ? (isPlayerAttacking ? 'player' : 'enemy') : (isPlayerAttacking ? 'enemy' : 'player') 
      });
      await new Promise(r => setTimeout(r, 600));
    }

    let damage = 0;
    if (hitType === 'miss') {
      addLog(`${attacker.name}'s focus wavered. Move missed!`, 'system');
    } else if (move.isDefensive) {
      if (isPlayerAttacking) {
        setPlayerDefense(prev => prev + 0.4);
        addLog(`${attacker.name} draws ethereal energy. Defense rose!`, 'system');
      } else {
        setEnemyDefense(prev => prev + 0.3);
        addLog(`${attacker.name} solidifies its spectral form!`, 'system');
      }
    } else {
      // Play damage SFX if hit occurs
      if (!isMuted && damageSfx.current) {
        damageSfx.current.currentTime = 0;
        damageSfx.current.volume = sfxVolume;
        damageSfx.current.play().catch(e => console.log("SFX error", e));
      }

      const multiplier = hitType === 'full' ? 1.0 : 0.6;
      const currentTargetDef = isPlayerAttacking ? enemyDefense : playerDefense;
      damage = Math.round((move.damage * multiplier) / currentTargetDef);
      
      if (isPlayerAttacking) {
        setEnemyHp(prev => Math.max(0, prev - damage));
        setAnimatingEnemy(true);
        setTimeout(() => setAnimatingEnemy(false), 300);
      } else {
        setPlayerHp(prev => Math.max(0, prev - damage));
        setAnimatingPlayer(true);
        setTimeout(() => setAnimatingPlayer(false), 300);
      }
      addLog(`${hitType === 'full' ? 'CRITICAL!' : 'SCRATCH!'} -${damage} Essence.`, 'system');
    }

    generateBattleNarrative(attacker.name, move.name, target.name, hitType as any, damage)
      .then(narrative => { if (narrative) addLog(narrative, 'narrative'); });

    await new Promise(r => setTimeout(r, 600));
    
    setAnimatingPlayer(false);
    setAnimatingEnemy(false);
    setIsActing(false);
    
    const finalEnemyHp = isPlayerAttacking ? enemyHp - damage : enemyHp;
    const finalPlayerHp = isPlayerAttacking ? playerHp : playerHp - damage;

    if (finalEnemyHp <= 0) {
      addLog(`${enemy.name} has been exorcised!`, 'system');
      const xpReward = 50 + (level * 10);
      const essenceReward = 20 + (level * 5);
      setTimeout(() => onVictory(xpReward, essenceReward), 1500);
      return true;
    }
    if (finalPlayerHp <= 0) {
      addLog(`${player.name} has faded into nothingness...`, 'system');
      setTimeout(onDefeat, 1500);
      return true;
    }

    return false;
  };

  const handlePlayerMove = async (move: Move) => {
    if (!isPlayerTurn || isActing || isPaused || playerMana < move.manaCost) return;
    setPlayerMana(prev => prev - move.manaCost);
    const finished = await executeMoveAction(player, enemy, move, true);
    if (!finished) setIsPlayerTurn(false);
  };

  const handleEnemyMove = useCallback(async () => {
    if (enemyHp <= 0 || isPlayerTurn || isActing || isPaused) return;
    await new Promise(r => setTimeout(r, 1200));
    const usableMoves = enemy.moves.filter(m => m.manaCost <= enemyMana);
    const move = usableMoves.length > 0 
      ? usableMoves[Math.floor(Math.random() * usableMoves.length)]
      : { name: 'Ethereal Rest', damage: 0, manaCost: 0, type: 'ghost' as const, accuracy: 100, isDefensive: true, animation: 'barrier' as AnimationType };
    setEnemyMana(prev => Math.max(0, prev - move.manaCost));
    const finished = await executeMoveAction(enemy, player, move, false);
    if (!finished) {
      setPlayerMana(prev => Math.min(player.maxMana, prev + 10));
      setEnemyMana(prev => Math.min(enemy.maxMana, prev + 10));
      setPlayerDefense(prev => Math.max(player.defense, prev - 0.1));
      setEnemyDefense(prev => Math.max(enemy.defense, prev - 0.1));
      setIsPlayerTurn(true);
    }
  }, [enemyHp, enemyMana, playerHp, playerMana, enemyDefense, playerDefense, enemy.moves, player.maxMana, enemy.maxMana, isPlayerTurn, isActing, isPaused, isMuted, sfxVolume]);

  useEffect(() => {
    if (!isPlayerTurn && !isActing && !isPaused) handleEnemyMove();
  }, [isPlayerTurn, isActing, isPaused, handleEnemyMove]);

  return (
    <div className="flex flex-col w-full h-full gap-4 relative">
      {/* Pause Menu */}
      {isPaused && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-[3rem] border border-white/10 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-10">
            <h2 className="text-6xl font-horror text-indigo-400">PAUSED</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => setIsPaused(false)} className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold transition-all transform hover:scale-105">
                RESUME RITUAL
              </button>
              <button onClick={onOpenTutorial} className="px-12 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-bold transition-all">
                DIRECTIONS
              </button>
              <button onClick={onQuit} className="px-12 py-4 bg-rose-900/40 hover:bg-rose-900 border border-rose-500/30 rounded-full font-bold text-rose-100 transition-all">
                QUIT TO MENU
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-indigo-950/40 p-4 rounded-3xl border border-indigo-900/50 backdrop-blur-lg z-10 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPaused(true)} className="w-12 h-12 bg-indigo-900/40 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl flex items-center justify-center transition-all group">
             <span className="text-xl group-hover:scale-110 transition-transform">⏸</span>
          </button>
          <div>
            <h3 className="font-horror text-3xl text-indigo-400 leading-none">ABYSS LEVEL {level} / 20</h3>
            <div className="h-1 w-full bg-indigo-900/30 rounded-full mt-2 overflow-hidden">
               <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(level/20)*100}%` }}></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs text-indigo-300 font-mono font-bold uppercase tracking-widest leading-none mb-1">LVL {player.level}</p>
          <p className={`text-xl font-horror tracking-widest leading-none ${isPlayerTurn ? 'text-cyan-400 animate-pulse' : 'text-rose-500'}`}>
            {isPlayerTurn ? "YOUR COMMAND" : "ENEMY RITUAL..."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow relative z-10 overflow-hidden">
        {activeAnimation && (
          <MoveVisuals type={activeAnimation.type} target={activeAnimation.target} onComplete={() => setActiveAnimation(null)} />
        )}

        {/* Enemy Arena */}
        <div className="flex flex-col items-center justify-between p-6 bg-slate-900/40 rounded-[3rem] border border-white/5 relative group">
          <StatusBar name={enemy.name} hp={enemyHp} maxHp={enemy.maxHp} mana={enemyMana} maxMana={enemy.maxMana} isEnemy />
          <div className={`relative w-48 h-48 md:w-72 md:h-72 transition-all duration-700 ${animatingEnemy ? 'scale-125 brightness-150' : 'scale-100'} ${isActing && !isPlayerTurn ? 'animate-bounce' : 'floating'}`}>
            <div className="aura-active absolute inset-0 rounded-full blur-[40px] opacity-40"></div>
            <img src={enemy.sprite} alt={enemy.name} className="w-full h-full object-cover rounded-[3rem] shadow-[0_0_50px_rgba(129,140,248,0.2)] border-2 border-indigo-500/20 transition-all" />
          </div>
          <div className="h-8"></div>
        </div>

        {/* Player Arena */}
        <div className="flex flex-col items-center justify-between p-6 bg-slate-900/40 rounded-[3rem] border border-white/5 relative group">
          <StatusBar name={player.name} hp={playerHp} maxHp={player.maxHp} mana={playerMana} maxMana={player.maxMana} />
          <div className={`relative w-48 h-48 md:w-72 md:h-72 transition-all duration-700 ${animatingPlayer ? 'scale-125 brightness-150' : 'scale-100'} ${isActing && isPlayerTurn ? 'animate-bounce' : 'floating'} ${!isPlayerTurn && !isActing ? 'aura-active' : ''}`}>
            <div className="absolute inset-0 rounded-full blur-[40px] opacity-20 bg-indigo-500/10"></div>
            <img src={player.sprite} alt={player.name} className="w-full h-full object-cover rounded-[3rem] shadow-[0_0_50px_rgba(129,140,248,0.2)] border-2 border-indigo-500/20 transition-all" />
          </div>
          <div className="h-8"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-auto lg:h-64 z-10">
        <div className="lg:col-span-3 grid grid-cols-2 gap-3 bg-indigo-950/20 p-4 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-2xl">
          {player.moves.map((move) => (
            <button
              key={move.name}
              disabled={!isPlayerTurn || isActing || isPaused || playerMana < move.manaCost}
              onClick={() => handlePlayerMove(move)}
              className={`group relative flex flex-col items-start p-4 rounded-3xl border-2 transition-all overflow-hidden ${
                isPlayerTurn && !isActing && !isPaused && playerMana >= move.manaCost
                  ? 'border-indigo-900/50 hover:border-indigo-400 bg-indigo-900/20 hover:bg-indigo-900/40 active:scale-95'
                  : 'border-slate-800 bg-slate-900/50 opacity-30 cursor-not-allowed grayscale'
              }`}
            >
              <div className="flex justify-between w-full mb-1">
                <span className="font-horror text-xl text-slate-100 group-hover:text-indigo-300">{move.name}</span>
                <span className="text-cyan-400 font-mono font-bold">{move.manaCost} MP</span>
              </div>
              <div className="flex gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${TYPE_COLORS[move.type]}`}>
                  {move.type}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-slate-400 font-bold uppercase tracking-widest">
                  {move.isDefensive ? 'SUPPORT' : `${move.damage} PWR`}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-black/60 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-md shadow-inner">
          <div className="p-2 border-b border-white/5 bg-white/5 text-[9px] font-bold uppercase text-slate-500 tracking-[0.4em] text-center">
            VOID LOGS
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className={`p-2 rounded-xl text-[11px] leading-tight ${
                log.type === 'player' ? 'text-indigo-300 border-l-2 border-indigo-500 pl-2' :
                log.type === 'enemy' ? 'text-rose-400 border-l-2 border-rose-500 pl-2' :
                log.type === 'narrative' ? 'text-slate-400 italic' : 'text-slate-500'
              }`}>
                {log.message}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
