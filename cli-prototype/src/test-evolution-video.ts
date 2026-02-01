/**
 * Evolution Video Generation Test
 * Creates cinematic "evolution" videos for milestone elements
 *
 * Goal: Epic, 8-second videos showing the cosmic history of an element
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY!;
const OUTPUT_DIR = path.join(__dirname, "..", "outputs", "evolution-videos");
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

// Milestone definitions with epic evolution prompts
const MILESTONE_PROMPTS = {
  life: {
    name: "LIFE",
    lore: "The universe opened its eyes for the first time. It saw itself. It wondered.",
    prompt: `Cinematic cosmic evolution sequence: The birth of LIFE in the universe.

Opening shot: Dark primordial void with swirling particles of energy and matter.
Transition: Particles begin to dance and combine, forming complex patterns.
Climax: A brilliant explosion of light as the first living cell emerges, pulsing with inner glow.
Final shot: Camera pulls back to reveal countless lights awakening across the cosmos.

Style: Epic scale, sweeping camera movements, dramatic lighting transitions from darkness to radiant life.
Color palette: Deep space blacks and purples transitioning to warm golden and green bioluminescence.
Mood: Awe-inspiring, genesis moment, the universe becoming aware.
Camera: Macro to cosmic zoom out, slow motion particle effects.`
  },

  consciousness: {
    name: "CONSCIOUSNESS",
    lore: "The universe asked its first question: Why?",
    prompt: `Cinematic cosmic evolution: The awakening of CONSCIOUSNESS.

Opening: Abstract neural patterns forming in cosmic clouds, synapses firing like galaxies.
Transition: A single point of awareness emerges, looking outward for the first time.
Climax: The moment of self-recognition - reality folding in on itself, fractals of thought expanding infinitely.
Final shot: An eye made of stars opens slowly, seeing everything.

Style: Surreal, dreamlike, philosophical. Mix of macro neural imagery and cosmic scale.
Color palette: Deep blues and violets with electric white consciousness sparks.
Mood: Profound awakening, existential wonder, the universe becoming self-aware.
Camera: Intimate close-ups transitioning to infinite zoom out.`
  },

  civilization: {
    name: "CIVILIZATION",
    lore: "They built towers to touch the sky. They wrote stories to outlive their bodies.",
    prompt: `Cinematic timelapse evolution: The rise of CIVILIZATION across eons.

Opening: Primitive beings around a fire, shadows dancing on cave walls.
Transition: Cities rise from dust, towers grow toward the sky, ships sail uncharted waters.
Climax: A magnificent metropolis at its peak - spires of light, flying vessels, monuments to achievement.
Final shot: Camera rises above the clouds to show the city as one bright point among millions across a planet.

Style: Epic historical sweep, timelapse of millennia compressed to seconds.
Color palette: Warm firelight to cool moonlight to brilliant golden age radiance.
Mood: Pride, ambition, the triumph of collective will.
Camera: Ground level rising to god's eye view.`
  },

  transcendence: {
    name: "TRANSCENDENCE",
    lore: "A few stopped fearing the end. They stepped into it willingly.",
    prompt: `Cinematic cosmic evolution: The moment of TRANSCENDENCE.

Opening: A being of light at the edge of a black hole, facing the infinite void.
Transition: They release their form, dissolving into pure energy, merging with the cosmos.
Climax: The boundary between self and universe dissolves - they become everything and nothing.
Final shot: Where the being stood, a new star is born, and their consciousness ripples across all of spacetime.

Style: Ethereal, spiritual, the boundary between existence and non-existence.
Color palette: White and gold dissolving into prismatic rainbow light, then pure cosmic white.
Mood: Peace, acceptance, becoming infinite.
Camera: Follows the dissolving form, then expands to show the cosmic ripple effect.`
  }
};

interface GenerationResult {
  milestone: string;
  success: boolean;
  videoPath?: string;
  duration?: number;
  error?: string;
}

async function generateEvolutionVideo(
  milestoneKey: keyof typeof MILESTONE_PROMPTS
): Promise<GenerationResult> {
  const milestone = MILESTONE_PROMPTS[milestoneKey];
  console.log(`\n🎬 Generating: ${milestone.name}`);
  console.log(`   "${milestone.lore}"`);

  const model = "veo-3.1-fast-generate-preview"; // Fast model for testing

  try {
    // Start generation job
    const startTime = Date.now();

    const startResponse = await fetch(
      `${BASE_URL}/models/${model}:predictLongRunning?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: milestone.prompt }],
          parameters: {
            aspectRatio: "16:9",
            durationSeconds: 8  // Request 8 seconds
          }
        })
      }
    );

    if (!startResponse.ok) {
      const error = await startResponse.text();

      // Try without durationSeconds if not supported
      if (error.includes("durationSeconds")) {
        console.log("   Retrying without duration parameter...");
        const retryResponse = await fetch(
          `${BASE_URL}/models/${model}:predictLongRunning?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              instances: [{ prompt: milestone.prompt }],
              parameters: { aspectRatio: "16:9" }
            })
          }
        );

        if (!retryResponse.ok) {
          throw new Error(`Failed to start: ${await retryResponse.text()}`);
        }

        const jobData = await retryResponse.json();
        return await pollForCompletion(jobData.name, milestone.name, startTime);
      }

      throw new Error(`Failed to start: ${error}`);
    }

    const jobData = await startResponse.json();
    console.log(`   Job started: ${jobData.name}`);

    return await pollForCompletion(jobData.name, milestone.name, startTime);

  } catch (error: any) {
    return {
      milestone: milestone.name,
      success: false,
      error: error.message
    };
  }
}

async function pollForCompletion(
  operationName: string,
  milestoneName: string,
  startTime: number
): Promise<GenerationResult> {
  let attempts = 0;
  const maxAttempts = 120;

  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 5000));
    attempts++;

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`\r   Generating... ${elapsed}s elapsed`);

    const statusResponse = await fetch(
      `${BASE_URL}/${operationName}?key=${API_KEY}`
    );

    if (!statusResponse.ok) continue;

    const status = await statusResponse.json();

    if (status.done) {
      console.log(`\n   ✅ Complete in ${elapsed}s`);

      if (status.error) {
        return {
          milestone: milestoneName,
          success: false,
          error: status.error.message
        };
      }

      // Download the video
      const videoUri = status.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;

      if (videoUri) {
        const videoPath = await downloadVideo(videoUri, milestoneName);
        return {
          milestone: milestoneName,
          success: true,
          videoPath,
          duration: elapsed
        };
      }

      return {
        milestone: milestoneName,
        success: false,
        error: "No video URI in response"
      };
    }
  }

  return {
    milestone: milestoneName,
    success: false,
    error: "Timeout waiting for generation"
  };
}

async function downloadVideo(uri: string, name: string): Promise<string> {
  const downloadUrl = `${uri}&key=${API_KEY}`;
  const fileName = `${name.toLowerCase()}-evolution.mp4`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  console.log(`   Downloading video...`);

  const response = await fetch(downloadUrl, { redirect: 'follow' });

  if (!response.ok) {
    // Try with explicit follow
    const manualResponse = await fetch(downloadUrl);
    if (manualResponse.status === 302) {
      const redirectUrl = manualResponse.headers.get('location');
      if (redirectUrl) {
        const finalResponse = await fetch(redirectUrl);
        const buffer = Buffer.from(await finalResponse.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`   Saved: ${fileName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
        return filePath;
      }
    }
    throw new Error(`Download failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  console.log(`   Saved: ${fileName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
  return filePath;
}

async function main() {
  console.log("🌟 Omnigenesis Evolution Video Generator");
  console.log("=========================================");
  console.log("Generating cinematic evolution videos for milestone elements\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate videos for key milestones
  const milestones: (keyof typeof MILESTONE_PROMPTS)[] = ['life', 'consciousness'];
  const results: GenerationResult[] = [];

  for (const milestone of milestones) {
    const result = await generateEvolutionVideo(milestone);
    results.push(result);

    if (!result.success) {
      console.log(`   ❌ Failed: ${result.error}`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Summary:");
  console.log("=".repeat(50));

  for (const result of results) {
    if (result.success) {
      console.log(`✅ ${result.milestone}: ${result.videoPath}`);
      console.log(`   Generated in ${result.duration}s`);
    } else {
      console.log(`❌ ${result.milestone}: ${result.error}`);
    }
  }

  console.log("\n📁 Videos saved to:", OUTPUT_DIR);
  console.log("\nReview the videos and let me know if the quality is good!");
}

main().catch(console.error);
