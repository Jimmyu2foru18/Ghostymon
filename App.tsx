
import React, { useState, useEffect, useRef } from 'react';
import { ScreenState, Monster, PlayerProgress } from './types';
import { STARTER_MONSTERS, ENEMIES, ALL_PLAYABLE_MONSTERS } from './constants';
import CharacterSelection from './components/CharacterSelection';
import BattleArena from './components/BattleArena';
import VoidAltar from './components/VoidAltar';
import GameOverlay from './components/GameOverlay';
import BossCinematic from './components/BossCinematic';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('START');
  const [playerMonster, setPlayerMonster] = useState<Monster | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [enemyMonster, setEnemyMonster] = useState<Monster | null>(null);
  
  // Audio Settings
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(() => Number(localStorage.getItem('ghostymon_music_vol')) || 0.5);
  const [sfxVolume, setSfxVolume] = useState(() => Number(localStorage.getItem('ghostymon_sfx_vol')) || 0.7);
  const [showSettings, setShowSettings] = useState(false);

  // Audio Refs
  const menuMusic = useRef<HTMLAudioElement | null>(null);
  const battleMusic = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    menuMusic.current = new Audio('Character select game open sound.mp3');
    menuMusic.current.loop = true;
    battleMusic.current = new Audio('Game Music to loop.mp3');
    battleMusic.current.loop = true;

    return () => {
      menuMusic.current?.pause();
      battleMusic.current?.pause();
    };
  }, []);

  // Update Volumes and Persist
  useEffect(() => {
    const effectiveMusicVol = isMuted ? 0 : musicVolume;
    if (menuMusic.current) menuMusic.current.volume = effectiveMusicVol;
    if (battleMusic.current) battleMusic.current.volume = effectiveMusicVol;
    localStorage.setItem('ghostymon_music_vol', musicVolume.toString());
    localStorage.setItem('ghostymon_sfx_vol', sfxVolume.toString());
  }, [musicVolume, sfxVolume, isMuted]);

  // Handle Music Transitions
  useEffect(() => {
    if (isMuted) {
      menuMusic.current?.pause();
      battleMusic.current?.pause();
      return;
    }

    if (screen === 'START' || screen === 'CHARACTER_SELECT' || screen === 'TUTORIAL' || screen === 'INFO') {
      battleMusic.current?.pause();
      if (screen !== 'START') {
        menuMusic.current?.play().catch(() => console.log("Autoplay prevented"));
      }
    } else if (screen === 'BATTLE' || screen === 'BOSS_CINEMATIC' || screen === 'UPGRADE') {
      menuMusic.current?.pause();
      battleMusic.current?.play().catch(() => console.log("Autoplay prevented"));
    }
  }, [screen, isMuted]);

  // Persistent Progress
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const saved = localStorage.getItem('ghostymon_save');
    return saved ? JSON.parse(saved) : {
      unlockedIds: STARTER_MONSTERS.map(m => m.id),
      soulEssence: 0,
      monsterStats: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('ghostymon_save', JSON.stringify(progress));
  }, [progress]);

  const startGame = () => {
    setScreen('CHARACTER_SELECT');
    if (!isMuted) {
      menuMusic.current?.play().catch(() => {});
    }
  };

  const getEnhancedMonster = (monster: Monster): Monster => {
    const stats = progress.monsterStats[monster.id] || { level: 1, xp: 0, hpBonus: 0, manaBonus: 0 };
    return {
      ...monster,
      level: stats.level,
      xp: stats.xp,
      maxHp: monster.maxHp + (stats.level - 1) * 10 + stats.hpBonus,
      maxMana: monster.maxMana + (stats.level - 1) * 10 + stats.manaBonus,
      defense: monster.defense + (stats.level - 1) * 0.05
    };
  };

  const handleSelectMonster = (monster: Monster) => {
    const enhanced = getEnhancedMonster(monster);
    setPlayerMonster({ ...enhanced, currentHp: enhanced.maxHp, currentMana: enhanced.maxMana });
    const levelEnemy = ENEMIES[currentLevel];
    setEnemyMonster({ ...levelEnemy, currentHp: levelEnemy.maxHp, currentMana: levelEnemy.maxMana });
    
    if ([5, 10, 15, 20].includes(currentLevel)) {
      setScreen('BOSS_CINEMATIC');
    } else {
      setScreen('BATTLE');
    }
  };

  const handleBattleVictory = (xpGained: number, essenceGained: number) => {
    if (!playerMonster) return;

    const currentStats = progress.monsterStats[playerMonster.id] || { level: 1, xp: 0, hpBonus: 0, manaBonus: 0 };
    let newXp = currentStats.xp + xpGained;
    let newLevel = currentStats.level;

    while (newXp >= 100 * newLevel) {
      newXp -= 100 * newLevel;
      newLevel++;
    }

    let newUnlocked = [...progress.unlockedIds];
    if (currentLevel === 5 && !newUnlocked.includes('p4')) newUnlocked.push('p4');
    if (currentLevel === 10 && !newUnlocked.includes('p5')) newUnlocked.push('p5');
    if (currentLevel === 15 && !newUnlocked.includes('p6')) newUnlocked.push('p6');
    if (currentLevel === 17 && !newUnlocked.includes('p7')) newUnlocked.push('p7');
    if (currentLevel === 19 && !newUnlocked.includes('p8')) newUnlocked.push('p8');

    setProgress(prev => ({
      ...prev,
      soulEssence: prev.soulEssence + essenceGained,
      unlockedIds: newUnlocked,
      monsterStats: {
        ...prev.monsterStats,
        [playerMonster.id]: {
          ...currentStats,
          xp: newXp,
          level: newLevel
        }
      }
    }));

    if (currentLevel >= 20) {
      setScreen('COMPLETE');
    } else {
      setScreen('UPGRADE');
    }
  };

  const nextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    if (playerMonster) {
      const enhanced = getEnhancedMonster(playerMonster);
      setPlayerMonster({ ...enhanced, currentHp: enhanced.maxHp, currentMana: enhanced.maxMana });
    }
    const nextEnemy = ENEMIES[nextLvl];
    setEnemyMonster({ ...nextEnemy, currentHp: nextEnemy.maxHp, currentMana: nextEnemy.maxMana });
    
    if ([5, 10, 15, 20].includes(nextLvl)) {
      setScreen('BOSS_CINEMATIC');
    } else {
      setScreen('BATTLE');
    }
  };

  const restartGame = () => {
    setScreen('START');
    setCurrentLevel(1);
  };

  const quitToMenu = () => {
    if (confirm("Quit current battle and return to menu? Progress in this battle will be lost.")) {
      restartGame();
    }
  };

  return (
<div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center bg-[#02040a] text-slate-100 font-sans">

  {/* Dynamic Game Background */}
  <div className="fixed inset-0 z-0 pointer-events-none">
<img
  src={`${import.meta.env.BASE_URL}Background6.png`}
  alt="Void Background"
  className="w-full h-full object-cover"
/>


        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/30 rounded-full blur-[160px] opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[160px] opacity-40"></div>
      </div>

      {/* Audio & Settings Panel */}
      <div className="fixed top-6 right-6 z-[500] flex flex-col items-end gap-2">
        <div className="flex gap-2">
           <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all text-xl shadow-lg ${
              isMuted ? 'bg-rose-950/50 border-rose-500/30 text-rose-400' : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
            }`}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all text-xl shadow-lg ${
              showSettings ? 'bg-indigo-500 border-indigo-400 text-white rotate-90' : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
            }`}
          >
            ⚙️
          </button>
        </div>

        {showSettings && (
          <div className="mt-2 w-64 p-6 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 text-center">Spectral Audio</h4>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Music Volume</span>
                  <span>{Math.round(musicVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={musicVolume} 
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>SFX Volume</span>
                  <span>{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={sfxVolume} 
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                  isMuted ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-slate-800 border-white/5 text-slate-400'
                }`}
              >
                {isMuted ? 'UNMUTE ALL' : 'MUTE ALL'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="z-10 w-full max-w-6xl px-4 py-4 h-screen flex flex-col">
        {screen === 'START' && (
          <div className="text-center flex flex-col items-center justify-center flex-grow space-y-8">
            <h1 className="text-[7rem] md:text-[12rem] font-horror text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-900 drop-shadow-[0_0_50px_rgba(79,70,229,0.5)] floating">
              GHOSTYMON
            </h1>
            <div className="flex flex-col gap-4">
              <button onClick={startGame} className="group relative px-20 py-6 bg-black/40 border border-indigo-500/50 hover:border-indigo-400 text-indigo-100 font-horror text-4xl rounded-full shadow-2xl transition-all">
                ENTER THE VOID
              </button>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setScreen('TUTORIAL')} className="px-8 py-3 bg-slate-900/60 border border-slate-700 hover:border-indigo-500 rounded-full text-sm font-bold tracking-widest uppercase transition-all">
                  DIRECTIONS
                </button>
                <button onClick={() => setScreen('INFO')} className="px-8 py-3 bg-slate-900/60 border border-slate-700 hover:border-indigo-500 rounded-full text-sm font-bold tracking-widest uppercase transition-all">
                  INFO
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'CHARACTER_SELECT' && (
          <div className="flex-grow overflow-y-auto py-8">
            <button onClick={restartGame} className="mb-8 text-slate-500 hover:text-white transition-colors flex items-center gap-2">
              ← BACK TO GATEWAY
            </button>
            <CharacterSelection 
              onSelect={handleSelectMonster} 
              unlockedIds={progress.unlockedIds}
              monsterStats={progress.monsterStats}
            />
          </div>
        )}

        {screen === 'BOSS_CINEMATIC' && enemyMonster && (
          <BossCinematic 
            boss={enemyMonster} 
            level={currentLevel} 
            onComplete={() => setScreen('BATTLE')} 
          />
        )}

        {screen === 'BATTLE' && playerMonster && enemyMonster && (
          <BattleArena 
            player={playerMonster}
            enemy={enemyMonster}
            level={currentLevel}
            onVictory={(xp, essence) => handleBattleVictory(xp, essence)}
            onDefeat={() => setScreen('GAMEOVER')}
            updatePlayer={(m) => setPlayerMonster(m)}
            onQuit={quitToMenu}
            onOpenTutorial={() => setScreen('TUTORIAL')}
            isMuted={isMuted}
            sfxVolume={sfxVolume}
          />
        )}

        {screen === 'UPGRADE' && (
          <VoidAltar 
            essence={progress.soulEssence}
            monster={playerMonster!}
            onContinue={nextLevel}
            onUpgrade={(type, cost, value) => {
              setProgress(prev => ({
                ...prev,
                soulEssence: prev.soulEssence - cost,
                monsterStats: {
                  ...prev.monsterStats,
                  [playerMonster!.id]: {
                    ...prev.monsterStats[playerMonster!.id],
                    [type === 'hp' ? 'hpBonus' : 'manaBonus']: (prev.monsterStats[playerMonster!.id]?.[type === 'hp' ? 'hpBonus' : 'manaBonus'] || 0) + value
                  }
                }
              }));
              setPlayerMonster(prev => !prev ? null : {
                ...prev,
                [type === 'hp' ? 'maxHp' : 'maxMana']: prev[type === 'hp' ? 'maxHp' : 'maxMana'] + value,
                [type === 'hp' ? 'currentHp' : 'currentMana']: prev[type === 'hp' ? 'currentHp' : 'currentMana'] + value
              });
            }}
          />
        )}

        {screen === 'TUTORIAL' && (
          <GameOverlay title="DIRECTIONS" onClose={() => setScreen(playerMonster ? 'BATTLE' : 'START')}>
            <div className="space-y-6 text-slate-300">
              <section>
                <h3 className="text-xl font-horror text-indigo-400 mb-2">Combat Basics</h3>
                <p>Ghostymon battles are turn-based. Choose moves to damage your opponent's Essence (HP). Attacks have varying accuracy - they can hit full, partial, or miss entirely.</p>
              </section>
              <section>
                <h3 className="text-xl font-horror text-indigo-400 mb-2">Mana & Support</h3>
                <p>Every special move costs Mana (MP). Use support moves (Shields/Barriers) to increase your Defense permanently for that battle. Mana regenerates slightly each turn.</p>
              </section>
              <section>
                <h3 className="text-xl font-horror text-indigo-400 mb-2">Rewards & Unlocks</h3>
                <p>Winning earns you XP and Soul Essence. Spend Essence at the Void Altar to permanently boost your stats. New monsters unlock at Levels 5, 10, 15, 17, and 19.</p>
              </section>
            </div>
          </GameOverlay>
        )}

        {screen === 'INFO' && (
          <GameOverlay title="GAME INFO" onClose={() => setScreen('START')}>
            <div className="space-y-6 text-slate-300 text-center">
              <p className="text-xl">GHOSTYMON BATTLE v2.7</p>
              <p>A spectral strategy RPG through 20 levels of the abyss.</p>
              <div className="pt-8 opacity-50 text-sm">
                <p>Designed for Ghost Community Games</p>
				<p>@Th3viousGameus</p>
                <p>  @Its_GhostGirl</p>
				<p> © 2025</p> 
              </div>
            </div>
          </GameOverlay>
        )}

        {(screen === 'GAMEOVER' || screen === 'COMPLETE') && (
          <div className="flex flex-col items-center justify-center flex-grow text-center space-y-12">
            <h2 className={`text-7xl md:text-[10rem] font-horror ${screen === 'COMPLETE' ? 'text-indigo-400' : 'text-rose-600'}`}>
              {screen === 'COMPLETE' ? 'VOID MASTER' : 'FADED'}
            </h2>
            <button onClick={restartGame} className="px-16 py-6 bg-white/5 border border-white/10 hover:border-white/40 text-white font-horror text-3xl rounded-full transition-all">
              RESTART JOURNEY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
