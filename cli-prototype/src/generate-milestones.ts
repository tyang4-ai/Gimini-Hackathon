/**
 * Generate 9 Milestone Element Images
 * Pre-generates all milestone icons for the game
 *
 * Milestones:
 * - energy - The First Spark
 * - life - The Awakening
 * - consciousness - The Mirror
 * - civilization - The Gathering
 * - wisdom - The Understanding
 * - transcendence - The Becoming
 * - chaos - The Unmaking
 * - harmony - The Balance
 * - cosmos - The Everything
 *
 * Set IMAGE_MODEL in .env.local to choose backend:
 * - "imagen4" (default) - Uses Imagen 4
 * - "gemini" - Uses Gemini 2.5 Flash Image
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Imagen4Client, GeminiImageClient } from "./utils/imagen-client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY;
const IMAGE_MODEL = process.env.IMAGE_MODEL || "imagen4";

// Output to frontend public directory
const MILESTONES_DIR = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "public",
  "milestones"
);

// Poetic prompts for each milestone element
const MILESTONE_PROMPTS: Record<string, { name: string; prompt: string }> = {
  energy: {
    name: "The First Spark",
    prompt:
      "A primordial spark of pure energy, brilliant lightning bolt made of starlight, electric blue and white core radiating outward, the first motion in cosmic stillness, ethereal power awakening, celestial electricity dancing in void",
  },
  life: {
    name: "The Awakening",
    prompt:
      "The first seed of life emerging from cosmic waters, a luminous green-gold sprout with DNA helixes spiraling upward, delicate yet unstoppable, cellular patterns glowing with inner light, genesis moment of organic existence",
  },
  consciousness: {
    name: "The Mirror",
    prompt:
      "A cosmic eye opening for the first time, seeing itself reflected infinitely, iris made of swirling galaxies, pupil as deep as the void, awareness dawning, the universe becoming self-aware, third eye mystical awakening",
  },
  civilization: {
    name: "The Gathering",
    prompt:
      "Ancient crystalline city towers rising from cosmic mist, spires of light and memory, collective dreams made manifest, golden architecture reaching toward stars, interconnected pathways of shared wisdom, celestial metropolis",
  },
  wisdom: {
    name: "The Understanding",
    prompt:
      "An ancient owl formed from starlight and shadows, eyes holding millennia of knowledge, feathers made of written scrolls and cosmic truths, serene understanding beyond time, wisdom embodied as celestial being",
  },
  transcendence: {
    name: "The Becoming",
    prompt:
      "A luminous being ascending beyond physical form, dissolving into pure light and consciousness, butterfly wings made of aurora borealis, transformation complete, material becoming ethereal, ultimate cosmic evolution",
  },
  chaos: {
    name: "The Unmaking",
    prompt:
      "A swirling vortex of creative destruction, spiraling patterns of birth and death intertwined, fire meeting void in eternal dance, primordial chaos from which all possibility emerges, beautiful disorder, cosmic maelstrom",
  },
  harmony: {
    name: "The Balance",
    prompt:
      "Yin and yang made of cosmic energy, opposing forces in perfect equilibrium, swirling dance of light and shadow, celestial balance achieved, complementary opposites creating unity, peaceful cosmic mandala",
  },
  cosmos: {
    name: "The Everything",
    prompt:
      "Infinite galaxies spiraling within a single point, all of existence contained in one cosmic moment, stars being born and dying simultaneously, the totality of creation, everything that was and will be, universal infinity",
  },
};

interface GenerationResult {
  element: string;
  name: string;
  success: boolean;
  latencyMs: number;
  path?: string;
  error?: string;
}

async function generateMilestones(): Promise<void> {
  const modelName =
    IMAGE_MODEL === "gemini" ? "Gemini 2.5 Flash Image" : "Imagen 4";

  console.log("✨ Generating 9 Milestone Element Images");
  console.log(`   Using: ${modelName}`);
  console.log("==========================================\n");

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("❌ Error: Please set your GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  // Create client based on config
  const client =
    IMAGE_MODEL === "gemini"
      ? new GeminiImageClient(API_KEY)
      : new Imagen4Client(API_KEY);

  const results: GenerationResult[] = [];

  // Ensure output directory exists
  if (!fs.existsSync(MILESTONES_DIR)) {
    fs.mkdirSync(MILESTONES_DIR, { recursive: true });
  }

  const elements = Object.keys(MILESTONE_PROMPTS);

  console.log("Generating images...\n");

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const { name, prompt } = MILESTONE_PROMPTS[element];

    process.stdout.write(`  [${i + 1}/${elements.length}] ${element} (${name})...`);

    const outputPath = path.join(MILESTONES_DIR, `${element}.png`);
    const startTime = Date.now();

    const fullPrompt = `A cosmic ethereal representation of ${prompt}, glowing with inner light, floating in a dark void with subtle nebula colors in deep purples, blues and cosmic gold, mystical and ancient, game icon style, centered composition, high detail, digital art, dreamlike quality, celestial color palette`;

    const response = await client.generateImage(fullPrompt, outputPath, {
      aspectRatio: "1:1",
      imageSize: "1K",
    });

    const latencyMs = Date.now() - startTime;

    if (response.success) {
      console.log(` ✓ (${(latencyMs / 1000).toFixed(1)}s)`);
      results.push({
        element,
        name,
        success: true,
        latencyMs,
        path: outputPath,
      });
    } else {
      console.log(` ✗ ${response.error}`);
      results.push({
        element,
        name,
        success: false,
        latencyMs,
        error: response.error,
      });
    }

    // Delay between generations to avoid rate limiting
    if (i < elements.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n📊 Summary:`);
  console.log(`   Model: ${modelName}`);
  console.log(`   Total: ${elements.length}`);
  console.log(`   Success: ${successful.length}`);
  console.log(`   Failed: ${failed.length}`);

  if (successful.length > 0) {
    const avgLatency =
      successful.reduce((sum, r) => sum + r.latencyMs, 0) / successful.length;
    console.log(`   Avg latency: ${(avgLatency / 1000).toFixed(2)}s`);
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed elements:`);
    for (const f of failed) {
      console.log(`   - ${f.element} (${f.name}): ${f.error}`);
    }
  }

  if (successful.length === elements.length) {
    console.log("\n✅ All 9 milestone images generated successfully!");
    console.log(`   Location: ${MILESTONES_DIR}`);
    console.log("\n   Please review the images manually for quality.");
  } else if (successful.length >= 7) {
    console.log("\n⚠️  Most images generated. Review quality and retry failures.");
  } else {
    console.log("\n❌ Too many failures. Check API key, billing, and quota.");
  }

  console.log("=".repeat(50));

  // Save manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    model: modelName,
    directory: MILESTONES_DIR,
    elements: results.map((r) => ({
      id: r.element,
      name: r.name,
      filename: r.success ? `${r.element}.png` : null,
      success: r.success,
      error: r.error,
    })),
    stats: {
      total: elements.length,
      successful: successful.length,
      failed: failed.length,
    },
  };

  const manifestPath = path.join(MILESTONES_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n💾 Manifest saved to: ${manifestPath}`);
}

generateMilestones().catch(console.error);
