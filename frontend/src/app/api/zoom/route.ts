import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { zoomPrompt } from '@/lib/prompts';
import { findElementById } from '@/lib/elements';
import { DEMO_MODE, getDemoScene, getRandomDemoScene } from '@/lib/demoData';
import type {
  ZoomRequest,
  ZoomResponse,
  ZoomScene,
  SceneElement,
  DepthTier,
  ContextCallback,
} from '@/types';

// Schema for structured JSON output from Gemini
const SCENE_SCHEMA = {
  type: SchemaType.OBJECT as const,
  properties: {
    description: {
      type: SchemaType.STRING as const,
      description: '2-3 sentence poetic description of what the Witness sees inside',
    },
    elements: {
      type: SchemaType.ARRAY as const,
      items: {
        type: SchemaType.OBJECT as const,
        properties: {
          name: {
            type: SchemaType.STRING as const,
            description: 'Element name',
          },
          emoji: {
            type: SchemaType.STRING as const,
            description: 'Single Unicode emoji character like 🔥 or 💧 or ✨',
          },
          whisper: {
            type: SchemaType.STRING as const,
            description: 'Poetic one-liner',
          },
          position: {
            type: SchemaType.OBJECT as const,
            properties: {
              x: {
                type: SchemaType.NUMBER as const,
                description: 'X position percentage (0-100)',
              },
              y: {
                type: SchemaType.NUMBER as const,
                description: 'Y position percentage (0-100)',
              },
            },
            required: ['x', 'y'] as const,
          },
          canZoomInto: {
            type: SchemaType.BOOLEAN as const,
            description: 'Whether this element can be zoomed into',
          },
          canCombine: {
            type: SchemaType.BOOLEAN as const,
            description: 'Whether this element can be combined with others',
          },
        },
        required: ['name', 'emoji', 'whisper', 'position', 'canZoomInto', 'canCombine'] as const,
      },
      description: '3-5 clickable elements in the scene',
    },
    backgroundGradient: {
      type: SchemaType.STRING as const,
      description: 'CSS gradient string for the scene background',
    },
    memoryFragment: {
      type: SchemaType.STRING as const,
      nullable: true,
      description: 'Optional VERY SHORT lore hint (1-2 sentences, max 20 words). Set to null 80% of the time.',
    },
    contextCallback: {
      type: SchemaType.OBJECT as const,
      nullable: true,
      properties: {
        text: {
          type: SchemaType.STRING as const,
          description: 'Context callback text like "This reminds you of..."',
        },
        referencedElementId: {
          type: SchemaType.STRING as const,
          description: 'ID of the referenced element',
        },
        referencedDepth: {
          type: SchemaType.STRING as const,
          enum: ['I', 'II', 'III', 'IV', 'V+'],
          description: 'Depth tier of the referenced element',
        },
      },
      required: ['text', 'referencedElementId', 'referencedDepth'] as const,
      description: 'Optional context callback (10% chance)',
    },
  },
  required: ['description', 'elements', 'backgroundGradient'] as const,
};

// Track visited scenes to avoid repetition
const visitedScenes: string[] = [];

export async function POST(request: NextRequest): Promise<NextResponse<ZoomResponse>> {
  try {
    const body: ZoomRequest = await request.json();
    const { elementId, currentDepth, contextSummary, sceneElementData } = body;

    // Validate input
    if (!elementId) {
      return NextResponse.json(
        { success: false, error: 'Missing element ID' },
        { status: 400 }
      );
    }

    // Check for demo mode - return cached scene if available
    if (DEMO_MODE) {
      const demoScene = getDemoScene(elementId);
      if (demoScene) {
        console.log('[DEMO] Using cached scene for:', elementId);
        // Add artificial delay to simulate generation
        await new Promise(resolve => setTimeout(resolve, 800));
        return NextResponse.json({
          success: true,
          scene: demoScene,
        });
      }
      // If no cached scene in demo mode, return a random fallback scene
      console.log('[DEMO] No cached scene for:', elementId, '- using random fallback');
      await new Promise(resolve => setTimeout(resolve, 800));
      const fallbackScene = getRandomDemoScene();
      // Modify the fallback to match the requested element
      return NextResponse.json({
        success: true,
        scene: {
          ...fallbackScene,
          id: `zoom-${elementId}-${Date.now()}`,
          parentElementId: elementId,
        },
      });
    }

    // Find the element - or create a synthetic one from scene data
    let element = findElementById(elementId);

    if (!element && sceneElementData) {
      // Create a synthetic element from the scene element data
      element = {
        id: elementId,
        name: sceneElementData.name,
        emoji: sceneElementData.emoji,
        whisper: sceneElementData.whisper,
        category: 'regular' as const,
        depth: currentDepth || 'I',
        ancestry: [],
      };
    }

    if (!element) {
      return NextResponse.json(
        { success: false, error: 'Element not found' },
        { status: 404 }
      );
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        // @ts-expect-error - Gemini SDK types are too strict for enum schemas
        responseSchema: SCENE_SCHEMA,
        temperature: 0.7, // Lower for more consistent output
        maxOutputTokens: 1500, // Enough for full response
      },
    });

    // Generate the prompt
    const prompt = zoomPrompt(
      element,
      currentDepth || 'I',
      contextSummary || '',
      visitedScenes
    );

    // Call Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response - strip markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    let generatedScene: {
      description: string;
      elements: Array<{
        name: string;
        emoji: string;
        whisper: string;
        position: { x: number; y: number };
        canZoomInto: boolean;
        canCombine: boolean;
      }>;
      backgroundGradient: string;
      memoryFragment?: string | null;
      contextCallback?: {
        text: string;
        referencedElementId: string;
        referencedDepth: DepthTier;
      } | null;
    };

    try {
      generatedScene = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse zoom response:', cleanedText.slice(0, 500) + '...');
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Post-processing validation
    // Truncate overly long memoryFragment
    if (generatedScene.memoryFragment && generatedScene.memoryFragment.length > 200) {
      generatedScene.memoryFragment = generatedScene.memoryFragment.slice(0, 200) + '...';
    }

    // Validate and fix emoji fields
    generatedScene.elements = generatedScene.elements.map((el) => ({
      ...el,
      // Ensure emoji is a single character or use a fallback
      emoji: el.emoji && el.emoji.trim().length > 0 && el.emoji.trim().length <= 4
        ? el.emoji.trim()
        : '✨',
    }));

    // Generate a unique scene ID
    const sceneId = `scene-${elementId}-${Date.now()}`;

    // Track the scene description to avoid repetition
    visitedScenes.push(generatedScene.description.slice(0, 50));
    if (visitedScenes.length > 20) {
      visitedScenes.shift(); // Keep only last 20 scenes
    }

    // Create SceneElements with unique IDs
    const sceneElements: SceneElement[] = generatedScene.elements.map((el, index) => ({
      id: `${sceneId}-element-${index}`,
      name: el.name,
      emoji: el.emoji,
      whisper: el.whisper,
      position: {
        x: Math.max(0, Math.min(100, el.position.x)),
        y: Math.max(0, Math.min(100, el.position.y)),
      },
      canZoomInto: el.canZoomInto,
      canCombine: el.canCombine,
    }));

    // Build the context callback if present
    let contextCallback: ContextCallback | undefined;
    if (generatedScene.contextCallback) {
      contextCallback = {
        text: generatedScene.contextCallback.text,
        referencedElementId: generatedScene.contextCallback.referencedElementId,
        referencedDepth: generatedScene.contextCallback.referencedDepth,
      };
    }

    // Create the ZoomScene object
    const scene: ZoomScene = {
      id: sceneId,
      parentElementId: elementId,
      description: generatedScene.description,
      elements: sceneElements,
      depth: currentDepth || 'I',
      backgroundGradient: generatedScene.backgroundGradient,
      memoryFragment: generatedScene.memoryFragment || undefined,
      contextCallback,
    };

    return NextResponse.json({
      success: true,
      scene,
    });
  } catch (error) {
    console.error('Zoom API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
