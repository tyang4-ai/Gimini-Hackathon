import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { checkHint } from '@/lib/hints';
import { combinePrompt } from '@/lib/prompts';
import {
  PRIMORDIALS,
  MILESTONES,
  INTERMEDIATE_ELEMENTS,
  findElementById,
} from '@/lib/elements';
import type {
  Element,
  RegularElement,
  CombineRequest,
  CombineResponse,
  DepthTier,
} from '@/types';

// Schema for structured JSON output from Gemini
const ELEMENT_SCHEMA = {
  type: SchemaType.OBJECT as const,
  properties: {
    name: {
      type: SchemaType.STRING as const,
      description: '1-3 word element name',
    },
    emoji: {
      type: SchemaType.STRING as const,
      description: 'Single emoji representing the element',
    },
    whisper: {
      type: SchemaType.STRING as const,
      description: 'Poetic one-liner, 8-15 words',
    },
    depth: {
      type: SchemaType.STRING as const,
      enum: ['I', 'II', 'III', 'IV', 'V+'],
      description: 'Depth tier of the element',
    },
    ancestry: {
      type: SchemaType.ARRAY as const,
      items: {
        type: SchemaType.STRING as const,
      },
      description: 'IDs of parent elements',
    },
  },
  required: ['name', 'emoji', 'whisper', 'depth', 'ancestry'] as const,
};

// Track discovered elements in memory (would be DB in production)
const discoveredElements = new Map<string, Element>();

// Initialize with primordials
PRIMORDIALS.forEach((el) => discoveredElements.set(el.id, el));

export async function POST(request: NextRequest): Promise<NextResponse<CombineResponse>> {
  try {
    const body: CombineRequest = await request.json();
    const { elementA: elementAId, elementB: elementBId, contextTokens, elementAData, elementBData } = body;

    // Validate input
    if (!elementAId || !elementBId) {
      return NextResponse.json(
        { success: false, error: 'Missing element IDs' },
        { status: 400 }
      );
    }

    // Find the elements - check predefined first, then discovered elements, then client-provided data
    let elementA: Element | undefined = findElementById(elementAId);
    let elementB: Element | undefined = findElementById(elementBId);

    // If not found in predefined, check server-side discovered elements
    if (!elementA) {
      elementA = discoveredElements.get(elementAId);
    }
    if (!elementB) {
      elementB = discoveredElements.get(elementBId);
    }

    // If still not found, use client-provided data (for server restarts where client has localStorage)
    if (!elementA && elementAData) {
      const reconstructedElement: RegularElement = {
        id: elementAId,
        name: elementAData.name,
        emoji: elementAData.emoji,
        whisper: elementAData.whisper,
        category: 'regular',
        depth: elementAData.depth,
        ancestry: elementAData.ancestry,
      };
      discoveredElements.set(elementAId, reconstructedElement);
      elementA = reconstructedElement;
    }
    if (!elementB && elementBData) {
      const reconstructedElement: RegularElement = {
        id: elementBId,
        name: elementBData.name,
        emoji: elementBData.emoji,
        whisper: elementBData.whisper,
        category: 'regular',
        depth: elementBData.depth,
        ancestry: elementBData.ancestry,
      };
      discoveredElements.set(elementBId, reconstructedElement);
      elementB = reconstructedElement;
    }

    if (!elementA || !elementB) {
      return NextResponse.json(
        { success: false, error: `Element not found: ${!elementA ? elementAId : elementBId}. Please include element data in request.` },
        { status: 404 }
      );
    }

    // Get discovered element IDs for hint checking
    const discoveredIds = new Set(discoveredElements.keys());

    // Check for hints first
    const hint = checkHint(elementAId, elementBId, discoveredIds);

    // Check for predefined recipes in MILESTONES
    const sortedIds = [elementAId, elementBId].sort();

    for (const milestone of Object.values(MILESTONES)) {
      const sortedAncestry = [...milestone.ancestry].sort();
      if (
        sortedIds.length === sortedAncestry.length &&
        sortedIds.every((id, idx) => id === sortedAncestry[idx])
      ) {
        // It's a milestone combination!
        const isFirstDiscovery = !discoveredElements.has(milestone.id);
        discoveredElements.set(milestone.id, milestone);

        return NextResponse.json({
          success: true,
          result: {
            element: milestone,
            isMilestone: true,
            isIntermediate: false,
            isFirstDiscovery,
            hint: hint?.hint,
          },
        });
      }
    }

    // Check for predefined recipes in INTERMEDIATE_ELEMENTS
    for (const intermediate of Object.values(INTERMEDIATE_ELEMENTS)) {
      const sortedAncestry = [...intermediate.ancestry].sort();
      if (
        sortedIds.length === sortedAncestry.length &&
        sortedIds.every((id, idx) => id === sortedAncestry[idx])
      ) {
        // It's an intermediate element!
        const isFirstDiscovery = !discoveredElements.has(intermediate.id);
        discoveredElements.set(intermediate.id, intermediate);

        return NextResponse.json({
          success: true,
          result: {
            element: intermediate,
            isMilestone: false,
            isIntermediate: true,
            isFirstDiscovery,
            hint: hint?.hint,
          },
        });
      }
    }

    // If hint was triggered but no predefined recipe matched, return the hint
    if (hint) {
      return NextResponse.json({
        success: true,
        result: {
          element: elementA, // Return the first element as placeholder
          isMilestone: false,
          isIntermediate: false,
          isFirstDiscovery: false,
          hint: hint.hint,
        },
      });
    }

    // No predefined recipe - call Gemini Flash for AI-generated element
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        // @ts-expect-error - Gemini SDK types are too strict for enum schemas
        responseSchema: ELEMENT_SCHEMA,
        temperature: 0.9,
      },
    });

    const prompt = combinePrompt(elementA, elementB, contextTokens || 0);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let generatedElement: {
      name: string;
      emoji: string;
      whisper: string;
      depth: DepthTier;
      ancestry: string[];
    };

    try {
      generatedElement = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Create the Element object
    const newElementId = generatedElement.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const newElement: RegularElement = {
      id: newElementId,
      name: generatedElement.name,
      emoji: generatedElement.emoji,
      whisper: generatedElement.whisper,
      category: 'regular',
      depth: generatedElement.depth,
      ancestry: [elementAId, elementBId],
      discoveredAt: new Date(),
    };

    // Check if this is a first discovery
    const isFirstDiscovery = !discoveredElements.has(newElementId);
    discoveredElements.set(newElementId, newElement);

    return NextResponse.json({
      success: true,
      result: {
        element: newElement,
        isMilestone: false,
        isIntermediate: false,
        isFirstDiscovery,
      },
    });
  } catch (error) {
    console.error('Combine API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
