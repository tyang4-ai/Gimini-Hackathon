/**
 * Generate 12 Primordial Element Images
 * Pre-generates all base element icons for the game
 *
 * Elements:
 * - Matter: Stone, Water, Fire, Air
 * - Senses: Light, Silence, Shimmer, Void
 * - Abstract: Longing, Time, Mystery, Wonder
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
const PRIMORDIALS_DIR = path.join(__dirname, "..", "outputs", "primordials");

// Detailed prompts for each primordial element
const PRIMORDIAL_PROMPTS: Record<string, string> = {
  // Matter (4)
  stone:
    "An ancient primordial stone, dense and eternal, with subtle crystalline veins glowing faintly, floating in cosmic void, mystical game icon, centered",
  water:
    "Pure primordial water essence, a perfect sphere of crystalline liquid with inner glow, ripples frozen in time, cosmic background, mystical game icon",
  fire:
    "Primordial fire essence, eternal flame dancing in the void, orange and gold with white hot core, cosmic mystical style, game icon, centered",
  air: "Primordial air essence, swirling invisible currents made visible by stardust, ethereal spiral, cosmic void background, mystical game icon",

  // Senses (4)
  light:
    "Pure primordial light, radiant sphere of blinding brilliance, rays extending outward, cosmic source of all illumination, mystical game icon",
  silence:
    "Primordial silence, a dark sphere absorbing all sound, ripples of quiet emanating outward, peaceful void, cosmic mystical style, game icon",
  shimmer:
    "Primordial shimmer, iridescent essence that catches light in impossible ways, rainbow reflections, cosmic aurora, mystical game icon",
  void: "Primordial void, a sphere of absolute darkness, consuming light at its edges, cosmic emptiness, mystical and ancient, game icon",

  // Abstract (4)
  longing:
    "Primordial longing, ethereal heart-shaped essence reaching toward something unseen, soft pink and purple glow, cosmic yearning, mystical game icon",
  time: "Primordial time, an eternal hourglass with flowing stardust, past and future visible in its glass, cosmic mystical style, game icon",
  mystery:
    "Primordial mystery, a question mark made of swirling cosmic mist, unknowable depths, secrets within secrets, mystical game icon",
  wonder:
    "Primordial wonder, a star being born, eyes wide in the cosmos, childlike amazement crystallized, cosmic mystical style, game icon",
};

interface GenerationResult {
  element: string;
  success: boolean;
  latencyMs: number;
  path?: string;
  error?: string;
}

async function generatePrimordials(): Promise<void> {
  const modelName = IMAGE_MODEL === "gemini" ? "Gemini 2.5 Flash Image" : "Imagen 4";

  console.log("✨ Generating 12 Primordial Element Images");
  console.log(`   Using: ${modelName}`);
  console.log("==========================================\n");

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("❌ Error: Please set your GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  // Create client based on config
  const client =
    IMAGE_MODEL === "gemini" ? new GeminiImageClient(API_KEY) : new Imagen4Client(API_KEY);

  const results: GenerationResult[] = [];

  // Ensure output directory exists
  if (!fs.existsSync(PRIMORDIALS_DIR)) {
    fs.mkdirSync(PRIMORDIALS_DIR, { recursive: true });
  }

  const elements = Object.keys(PRIMORDIAL_PROMPTS);

  console.log("Generating images...\n");

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const prompt = PRIMORDIAL_PROMPTS[element];

    process.stdout.write(`  [${i + 1}/${elements.length}] ${element}...`);

    const outputPath = path.join(PRIMORDIALS_DIR, `${element}.png`);
    const startTime = Date.now();

    const response = await client.generateImage(
      `A cosmic ethereal representation of ${prompt}, glowing with inner light, floating in a dark void with subtle nebula colors, mystical and ancient, game icon style, centered composition, high detail, digital art`,
      outputPath,
      { aspectRatio: "1:1", imageSize: "1K" }
    );

    const latencyMs = Date.now() - startTime;

    if (response.success) {
      console.log(` ✓ (${(latencyMs / 1000).toFixed(1)}s)`);
      results.push({
        element,
        success: true,
        latencyMs,
        path: outputPath,
      });
    } else {
      console.log(` ✗ ${response.error}`);
      results.push({
        element,
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
      console.log(`   - ${f.element}: ${f.error}`);
    }
  }

  if (successful.length === elements.length) {
    console.log("\n✅ All 12 primordial images generated successfully!");
    console.log(`   Location: ${PRIMORDIALS_DIR}`);
    console.log("\n   Please review the images manually for quality.");
  } else if (successful.length >= 10) {
    console.log("\n⚠️  Most images generated. Review quality and retry failures.");
  } else {
    console.log("\n❌ Too many failures. Check API key, billing, and quota.");
  }

  console.log("=".repeat(50));

  // Save manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    model: modelName,
    directory: PRIMORDIALS_DIR,
    elements: results.map((r) => ({
      name: r.element,
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

  const manifestPath = path.join(PRIMORDIALS_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n💾 Manifest saved to: ${manifestPath}`);
}

generatePrimordials().catch(console.error);
