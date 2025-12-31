
import { Monster, GhostType } from './types';

const baseStats = { level: 1, xp: 0, nextLevelXp: 100 };

// Helper to generate filename from name: replace spaces with underscores and append .png
const getSprite = (name: string) => `${name.replace(/\s+/g, '_')}.png`;

export const ALL_PLAYABLE_MONSTERS: Monster[] = [
  {
    id: 'p1',
    name: 'The Infamous N',
    types: ['dark', 'ghost'],
    maxHp: 130,
    currentHp: 130,
    maxMana: 160,
    currentMana: 160,
    moves: [
      { name: 'Void Strike', damage: 45, manaCost: 20, type: 'dark', accuracy: 90, animation: 'slash' },
      { name: 'Ghost Slash', damage: 35, manaCost: 15, type: 'ghost', accuracy: 95, animation: 'slash' },
      { name: 'Shadow Shield', damage: 0, manaCost: 10, type: 'dark', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Phantom Edge', damage: 55, manaCost: 30, type: 'ghost', accuracy: 80, animation: 'bolt' }
    ],
    sprite: getSprite('The Infamous N'),
    defense: 1.0,
    ...baseStats
  },
  {
    id: 'p2',
    name: 'Sir Hennesy',
    types: ['fire', 'ghost'],
    maxHp: 110,
    currentHp: 110,
    maxMana: 200,
    currentMana: 200,
    moves: [
      { name: 'Inferno Burst', damage: 50, manaCost: 25, type: 'fire', accuracy: 85, animation: 'burst' },
      { name: 'Spirit Flare', damage: 40, manaCost: 15, type: 'ghost', accuracy: 95, animation: 'pulse' },
      { name: 'Royal Guard', damage: 0, manaCost: 15, type: 'fire', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Soul Burn', damage: 55, manaCost: 35, type: 'ghost', accuracy: 85, animation: 'drain' }
    ],
    sprite: getSprite('Sir Hennesy'),
    defense: 1.0,
    ...baseStats
  },
  {
    id: 'p3',
    name: 'Ryzablue',
    types: ['ice', 'ghost'],
    maxHp: 160,
    currentHp: 160,
    maxMana: 180,
    currentMana: 180,
    moves: [
      { name: 'Frost Spike', damage: 35, manaCost: 15, type: 'ice', accuracy: 95, animation: 'bolt' },
      { name: 'Glacial Chill', damage: 45, manaCost: 20, type: 'ghost', accuracy: 90, animation: 'pulse' },
      { name: 'Ice Barrier', damage: 0, manaCost: 10, type: 'ice', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Blue Mist', damage: 50, manaCost: 25, type: 'ghost', accuracy: 85, animation: 'drain' }
    ],
    sprite: getSprite('Ryzablue'),
    defense: 1.1,
    ...baseStats
  },
  {
    id: 'p4',
    name: 'Davis',
    types: ['rock', 'ghost'],
    maxHp: 200,
    currentHp: 200,
    maxMana: 120,
    currentMana: 120,
    moves: [
      { name: 'Boulder Hurl', damage: 50, manaCost: 25, type: 'rock', accuracy: 80, animation: 'burst' },
      { name: 'Earth Armor', damage: 0, manaCost: 20, type: 'rock', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Dust Storm', damage: 30, manaCost: 15, type: 'ghost', accuracy: 95, animation: 'pulse' },
      { name: 'Stone Gaze', damage: 60, manaCost: 40, type: 'ghost', accuracy: 75, animation: 'bolt' }
    ],
    sprite: getSprite('Davis'),
    defense: 1.3,
    ...baseStats
  },
  {
    id: 'p5',
    name: 'All Beans',
    types: ['fire', 'dark'],
    maxHp: 140,
    currentHp: 140,
    maxMana: 220,
    currentMana: 220,
    moves: [
      { name: 'Bean Blast', damage: 40, manaCost: 10, type: 'fire', accuracy: 95, animation: 'burst' },
      { name: 'Stalk Grow', damage: 0, manaCost: 20, type: 'fire', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Dark Roast', damage: 55, manaCost: 30, type: 'dark', accuracy: 85, animation: 'bolt' },
      { name: 'Fiber Force', damage: 70, manaCost: 45, type: 'ghost', accuracy: 80, animation: 'drain' }
    ],
    sprite: getSprite('All Beans'),
    defense: 1.0,
    ...baseStats
  },
  {
    id: 'p6',
    name: 'Fearless',
    types: ['dragon', 'ghost'],
    maxHp: 180,
    currentHp: 180,
    maxMana: 250,
    currentMana: 250,
    moves: [
      { name: 'Brave Heart', damage: 0, manaCost: 30, type: 'dragon', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Fear Strike', damage: 65, manaCost: 35, type: 'ghost', accuracy: 85, animation: 'slash' },
      { name: 'Void Breath', damage: 60, manaCost: 30, type: 'dragon', accuracy: 90, animation: 'pulse' },
      { name: 'Absolute End', damage: 90, manaCost: 60, type: 'dark', accuracy: 75, animation: 'burst' }
    ],
    sprite: getSprite('Fearless'),
    defense: 1.2,
    ...baseStats
  },
  {
    id: 'p7',
    name: 'Th3viousGameus',
    types: ['electric', 'dark'],
    maxHp: 170,
    currentHp: 170,
    maxMana: 240,
    currentMana: 240,
    moves: [
      { name: 'Game Over', damage: 75, manaCost: 45, type: 'dark', accuracy: 85, animation: 'burst' },
      { name: 'Circuit Break', damage: 55, manaCost: 25, type: 'electric', accuracy: 90, animation: 'bolt' },
      { name: 'Glitch Veil', damage: 0, manaCost: 30, type: 'dark', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Th3vious Strike', damage: 65, manaCost: 35, type: 'electric', accuracy: 95, animation: 'slash' }
    ],
    sprite: 'Th3viousGameus.png',
    defense: 1.15,
    ...baseStats
  },
  {
    id: 'p8',
    name: 'ChairCheese',
    types: ['fire', 'rock'],
    maxHp: 190,
    currentHp: 190,
    maxMana: 150,
    currentMana: 150,
    moves: [
      { name: 'Cheddar Blast', damage: 60, manaCost: 30, type: 'fire', accuracy: 85, animation: 'burst' },
      { name: 'Gouda Guard', damage: 0, manaCost: 20, type: 'rock', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Melted Kick', damage: 45, manaCost: 15, type: 'fire', accuracy: 90, animation: 'slash' },
      { name: 'Heavy Seating', damage: 70, manaCost: 40, type: 'rock', accuracy: 75, animation: 'bolt' }
    ],
    sprite: 'ChairCheese.png',
    defense: 1.25,
    ...baseStats
  }
];

export const STARTER_MONSTERS = ALL_PLAYABLE_MONSTERS.slice(0, 3);

const createEnemy = (id: string, name: string, level: number, type: GhostType, hp: number): Monster => ({
  id,
  name,
  types: [type, 'ghost'],
  maxHp: hp,
  currentHp: hp,
  maxMana: 100 + level * 10,
  currentMana: 100 + level * 10,
  defense: 1.0 + (level * 0.03),
  sprite: getSprite(name),
  moves: [
    { name: `${name} Strike`, damage: 18 + level * 2.5, manaCost: 10, type, accuracy: 90, animation: level % 2 === 0 ? 'slash' : 'bolt' },
    { name: 'Ghostly Haunt', damage: 12 + level * 2.5, manaCost: 10, type: 'ghost', accuracy: 95, animation: 'pulse' },
    { name: 'Specter Shield', damage: 0, manaCost: 15, type, isDefensive: true, accuracy: 100, animation: 'barrier' },
  ],
  ...baseStats
});

export const ENEMIES: Record<number, Monster> = {
  1: createEnemy('e1', 'Fearless', 1, 'dragon', 100),
  2: createEnemy('e2', 'V4lo', 2, 'ghost', 110),
  3: createEnemy('e3', 'Suki', 3, 'dragon', 125),
  4: createEnemy('e4', 'Bur Bear', 4, 'ice', 140),
  5: createEnemy('e5', 'Kybear', 5, 'rock', 160),
  6: createEnemy('e6', 'Jyhaz', 6, 'electric', 180),
  7: createEnemy('e7', 'Harley', 7, 'psychic', 210),
  8: createEnemy('e8', 'Coyote', 8, 'dark', 240),
  9: createEnemy('e9', 'Davis', 9, 'rock', 270),
  10: createEnemy('e10', 'White Crayon', 10, 'ghost', 310),
  11: createEnemy('e11', 'SharpSins', 11, 'dark', 350),
  12: createEnemy('e12', 'Finnish', 12, 'ice', 390),
  13: createEnemy('e13', '2nd Breakfast', 13, 'dragon', 430),
  14: createEnemy('e14', 'All Beans', 14, 'dark', 470),
  15: createEnemy('e15', 'SkyStarz', 15, 'ice', 520),
  16: createEnemy('e16', 'Dirk Dingles', 16, 'electric', 570),
  17: createEnemy('e17', 'BakedOven', 17, 'fire', 630),
  18: {
    id: 'e18',
    name: 'ChairCheese',
    types: ['fire', 'rock', 'ghost'],
    maxHp: 750,
    currentHp: 750,
    maxMana: 400,
    currentMana: 400,
    moves: [
      { name: 'Fromage Fury', damage: 70, manaCost: 40, type: 'fire', accuracy: 85, animation: 'burst' },
      { name: 'Solid Stance', damage: 0, manaCost: 30, type: 'rock', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Cheesy Grasp', damage: 55, manaCost: 20, type: 'ghost', accuracy: 90, animation: 'drain' }
    ],
    sprite: 'ChairCheese.png',
    defense: 1.5,
    ...baseStats
  },
  19: {
    id: 'e19',
    name: 'Th3viousGameus',
    types: ['electric', 'dark', 'ghost'],
    maxHp: 900,
    currentHp: 900,
    maxMana: 500,
    currentMana: 500,
    moves: [
      { name: 'System Crash', damage: 85, manaCost: 50, type: 'dark', accuracy: 85, animation: 'burst' },
      { name: 'Volt Drain', damage: 60, manaCost: 30, type: 'electric', accuracy: 95, animation: 'drain' },
      { name: 'Firewall', damage: 0, manaCost: 40, type: 'dark', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'Th3vious Verdict', damage: 110, manaCost: 80, type: 'electric', accuracy: 80, animation: 'bolt' }
    ],
    sprite: 'Th3viousGameus.png',
    defense: 1.6,
    ...baseStats
  },
  20: {
    id: 'e20',
    name: 'Ist_GhostGirl',
    types: ['psychic', 'ghost', 'dark'],
    maxHp: 1300,
    currentHp: 1300,
    maxMana: 800,
    currentMana: 800,
    moves: [
      { name: 'Psychic Scream', damage: 95, manaCost: 60, type: 'psychic', accuracy: 90, animation: 'burst' },
      { name: 'Eternal Night', damage: 85, manaCost: 40, type: 'dark', accuracy: 95, animation: 'drain' },
      { name: 'Soul Mirror', damage: 0, manaCost: 50, type: 'ghost', isDefensive: true, accuracy: 100, animation: 'barrier' },
      { name: 'The End', damage: 150, manaCost: 120, type: 'dark', accuracy: 75, animation: 'bolt' }
    ],
    sprite: 'Ist_GhostGirl.png',
    defense: 1.8,
    ...baseStats
  }
};

export const TYPE_COLORS: Record<GhostType, string> = {
  dark: 'bg-slate-900 text-slate-100',
  ghost: 'bg-indigo-900 text-indigo-100',
  fire: 'bg-orange-900 text-orange-100',
  ice: 'bg-cyan-900 text-cyan-100',
  psychic: 'bg-fuchsia-900 text-fuchsia-100',
  electric: 'bg-amber-800 text-amber-100',
  rock: 'bg-stone-800 text-stone-100',
  dragon: 'bg-violet-900 text-violet-100'
};
