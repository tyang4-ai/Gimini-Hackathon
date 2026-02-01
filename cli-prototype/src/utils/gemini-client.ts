/**
 * Gemini Flash API client for combination generation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CombinationResult {
  name: string;
  description: string;
  emoji: string;
  category: string;
}

export interface CombinationResponse {
  success: boolean;
  result?: CombinationResult;
  latencyMs: number;
  error?: string;
  rawResponse?: string;
}

// 12 Primordial Elements
export const PRIMORDIALS = [
  // Matter (4)
  { name: "Stone", category: "Matter", emoji: "🪨" },
  { name: "Water", category: "Matter", emoji: "💧" },
  { name: "Fire", category: "Matter", emoji: "🔥" },
  { name: "Air", category: "Matter", emoji: "💨" },
  // Senses (4)
  { name: "Light", category: "Senses", emoji: "✨" },
  { name: "Silence", category: "Senses", emoji: "🤫" },
  { name: "Shimmer", category: "Senses", emoji: "💫" },
  { name: "Void", category: "Senses", emoji: "🕳️" },
  // Abstract (4)
  { name: "Longing", category: "Abstract", emoji: "💭" },
  { name: "Time", category: "Abstract", emoji: "⏳" },
  { name: "Mystery", category: "Abstract", emoji: "❓" },
  { name: "Wonder", category: "Abstract", emoji: "🌟" },
];

const COMBINATION_PROMPT = `You are the cosmic oracle of Omnigenesis, a universe where elements combine to create new things.

Given two elements, create a new combined element that emerges from their fusion.

RULES:
- The result should feel like a natural/magical combination of both inputs
- Be creative but keep names concise (1-3 words)
- Description should be evocative but brief (10-20 words)
- Choose an appropriate emoji
- Category should be: Matter, Energy, Life, Concept, Force, or Phenomenon

INPUT ELEMENTS:
Element 1: {element1}
Element 2: {element2}

Respond ONLY with valid JSON in this exact format:
{
  "name": "New Element Name",
  "description": "A brief, evocative description of what this element represents",
  "emoji": "🔮",
  "category": "Category"
}`;

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 500,
        responseMimeType: "application/json",
      },
    });
  }

  async combine(
    element1: string,
    element2: string
  ): Promise<CombinationResponse> {
    const startTime = Date.now();

    try {
      const prompt = COMBINATION_PROMPT.replace("{element1}", element1).replace(
        "{element2}",
        element2
      );

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const latencyMs = Date.now() - startTime;

      // Parse JSON response
      const parsed = JSON.parse(text) as CombinationResult;

      // Validate required fields
      if (!parsed.name || !parsed.description || !parsed.emoji) {
        return {
          success: false,
          latencyMs,
          error: "Missing required fields in response",
          rawResponse: text,
        };
      }

      return {
        success: true,
        result: parsed,
        latencyMs,
        rawResponse: text,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  getRandomPair(): [string, string] {
    const shuffled = [...PRIMORDIALS].sort(() => Math.random() - 0.5);
    return [shuffled[0].name, shuffled[1].name];
  }
}
