
export type GhostType = 'dark' | 'ghost' | 'fire' | 'ice' | 'psychic' | 'electric' | 'rock' | 'dragon';

export type AnimationType = 'slash' | 'burst' | 'pulse' | 'barrier' | 'bolt' | 'drain';

export interface Move {
  name: string;
  damage: number;
  manaCost: number;
  type: GhostType;
  accuracy: number;
  isDefensive?: boolean;
  animation?: AnimationType;
}

export interface Monster {
  id: string;
  name: string;
  types: GhostType[];
  maxHp: number;
  currentHp: number;
  maxMana: number;
  currentMana: number;
  moves: Move[];
  sprite: string;
  defense: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export type ScreenState = 'START' | 'CHARACTER_SELECT' | 'BATTLE' | 'VICTORY' | 'GAMEOVER' | 'COMPLETE' | 'UPGRADE' | 'TUTORIAL' | 'INFO' | 'BOSS_CINEMATIC';

export interface BattleLogEntry {
  message: string;
  type: 'player' | 'enemy' | 'system' | 'narrative';
}

export interface PlayerProgress {
  unlockedIds: string[];
  soulEssence: number;
  monsterStats: Record<string, {
    level: number;
    xp: number;
    hpBonus: number;
    manaBonus: number;
  }>;
}
