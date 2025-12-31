
import { GoogleGenAI } from "@google/genai";

export const generateBattleNarrative = async (
  monsterName: string, 
  moveName: string, 
  targetName: string,
  hitType: 'full' | 'partial' | 'miss',
  damage: number
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the narrator for a dark ghost-themed battle game called Ghostymon. 
      Briefly describe the action: ${monsterName} used ${moveName} on ${targetName}. 
      Result: ${hitType} hit. Damage: ${damage}.
      Keep it spooky, 1 short sentence.`,
      config: {
        temperature: 0.8
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini narrative error:", error);
    return "";
  }
};

export const generateBossIntro = async (bossName: string, level: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a herald of the void in the game Ghostymon. 
      Provide a chilling 2-sentence introduction for the boss "${bossName}" who guards level ${level}. 
      The tone should be foreboding and cinematic.`,
      config: {
        temperature: 0.9
      }
    });
    return response.text || `The abyss trembles as ${bossName} emerges from the shadows of level ${level}. Your soul is forfeit.`;
  } catch (error) {
    console.error("Gemini boss intro error:", error);
    return `The abyss trembles as ${bossName} emerges from the shadows of level ${level}. Your soul is forfeit.`;
  }
};
