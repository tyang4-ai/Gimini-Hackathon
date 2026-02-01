import { NextRequest, NextResponse } from 'next/server';
import { findElementById, MILESTONES } from '@/lib/elements';
import { evolutionPrompt } from '@/lib/prompts';
import type { MilestoneElement } from '@/types';

// Response types
interface EvolutionResponse {
  success: boolean;
  operationName?: string;
  videoUrl?: string;
  error?: string;
}

interface EvolutionRequest {
  milestoneId: string;
  elementName?: string;
  elementEmoji?: string;
  lore?: string;
}

// Veo 3.1 model for high-quality video generation
const VEO_MODEL = 'veo-3.1-generate-preview';

export async function POST(request: NextRequest): Promise<NextResponse<EvolutionResponse>> {
  try {
    const body: EvolutionRequest = await request.json();
    const { milestoneId, elementName, elementEmoji, lore } = body;

    // Validate input
    if (!milestoneId) {
      return NextResponse.json(
        { success: false, error: 'Missing milestoneId' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Find the milestone element
    let milestone = findElementById(milestoneId);

    // If not found in elements, check if we have custom data from the request
    if (!milestone) {
      // Check if it's a known milestone
      if (MILESTONES[milestoneId]) {
        milestone = MILESTONES[milestoneId];
      } else if (elementName && lore) {
        // Create a pseudo-element for custom evolution requests
        milestone = {
          id: milestoneId,
          name: elementName,
          emoji: elementEmoji || '✨',
          whisper: lore.substring(0, 50),
          category: 'milestone',
          depth: 'III',
          ancestry: [],
          imageUrl: '',
          lore: lore,
          hasBeenEvolved: false,
        } as MilestoneElement;
      } else {
        return NextResponse.json(
          { success: false, error: `Milestone not found: ${milestoneId}` },
          { status: 404 }
        );
      }
    }

    // Ensure it's a milestone element with lore
    if (milestone.category !== 'milestone') {
      return NextResponse.json(
        { success: false, error: 'Element is not a milestone' },
        { status: 400 }
      );
    }

    // Generate the evolution prompt for Veo
    const prompt = evolutionPrompt(milestone);

    // Start the video generation with predictLongRunning
    // Veo video generation is async and returns an operation name
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${VEO_MODEL}:predictLongRunning?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            aspectRatio: '16:9',
            // durationSeconds: 8 - commented out as it may not be supported
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Veo API error:', errorText);

      // Try without duration parameter if that was the issue
      if (errorText.includes('durationSeconds')) {
        const retryResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${VEO_MODEL}:predictLongRunning?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt }],
              parameters: {
                aspectRatio: '16:9',
              },
            }),
          }
        );

        if (!retryResponse.ok) {
          const retryError = await retryResponse.text();
          return NextResponse.json(
            { success: false, error: `Failed to start video generation: ${retryError}` },
            { status: 500 }
          );
        }

        const retryData = await retryResponse.json();
        return NextResponse.json({
          success: true,
          operationName: retryData.name,
        });
      }

      return NextResponse.json(
        { success: false, error: `Failed to start video generation: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    // The response contains an operation name for polling
    // Format: "operations/{operation-id}"
    const operationName = data.name;

    if (!operationName) {
      return NextResponse.json(
        { success: false, error: 'No operation name returned' },
        { status: 500 }
      );
    }

    // Return the operation name for the client to poll
    return NextResponse.json({
      success: true,
      operationName,
    });

  } catch (error) {
    console.error('Evolution API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check evolution status
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const operationName = searchParams.get('operationName');

    if (!operationName) {
      return NextResponse.json(
        { success: false, error: 'Missing operationName parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Poll the operation status
    const statusResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`
    );

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      return NextResponse.json(
        { success: false, error: `Failed to check status: ${errorText}` },
        { status: 500 }
      );
    }

    const status = await statusResponse.json();

    if (status.done) {
      if (status.error) {
        return NextResponse.json({
          success: false,
          error: status.error.message || 'Video generation failed',
          status: 'failed',
        });
      }

      // Extract video URL from response
      const videoUri = status.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;

      if (videoUri) {
        // The URI needs the API key appended for download
        const videoUrl = `${videoUri}&key=${apiKey}`;
        return NextResponse.json({
          success: true,
          status: 'complete',
          videoUrl,
        });
      }

      return NextResponse.json({
        success: false,
        error: 'No video URI in response',
        status: 'failed',
      });
    }

    // Still in progress
    return NextResponse.json({
      success: true,
      status: 'generating',
      progress: status.metadata?.progress || 0,
    });

  } catch (error) {
    console.error('Evolution status API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
