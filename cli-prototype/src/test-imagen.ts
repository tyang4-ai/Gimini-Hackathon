/**
 * Image Generation API Benchmark
 * Tests image generation calls to validate latency and quality
 *
 * Supports two backends:
 * - Imagen 4 (imagen-4.0-generate-001) - Higher quality
 * - Gemini Image (gemini-2.5-flash-image) - Faster, cheaper
 *
 * Set IMAGE_MODEL in .env.local to choose:
 * - "imagen4" (default) - Uses Imagen 4
 * - "gemini" - Uses Gemini 2.5 Flash Image
 *
 * Target: p95 < 2s
 * Kill threshold: p95 > 3s
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  Imagen4Client,
  GeminiImageClient,
  ImageGenerationResponse,
} from "./utils/imagen-client.js";
import { calculateStats, printStats, LatencyStats } from "./utils/stats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY;
const IMAGE_MODEL = process.env.IMAGE_MODEL || "imagen4"; // "imagen4" or "gemini"
const NUM_TESTS = 30;
const RESULTS_DIR = path.join(__dirname, "..", "outputs", "results");
const IMAGES_DIR = path.join(__dirname, "..", "outputs", "imagen-test");

// Test prompts - mix of element icons and scene backgrounds
const TEST_PROMPTS = [
  // Element icons (cosmic style)
  { type: "icon", prompt: "Crystalline fire essence, burning eternally" },
  { type: "icon", prompt: "Frozen water droplet with inner glow" },
  { type: "icon", prompt: "Ancient stone with carved runes" },
  { type: "icon", prompt: "Swirling vortex of pure air" },
  { type: "icon", prompt: "Radiant light sphere, blinding brightness" },
  { type: "icon", prompt: "Dark void portal, consuming all" },
  { type: "icon", prompt: "Shimmering aurora essence" },
  { type: "icon", prompt: "Silent bell, muted vibrations" },
  { type: "icon", prompt: "Hourglass of flowing time" },
  { type: "icon", prompt: "Question mark made of stardust" },
  { type: "icon", prompt: "Heart of longing, ethereal yearning" },
  { type: "icon", prompt: "Constellation of wonder" },
  // Combined elements
  { type: "icon", prompt: "Steam rising from cosmic waters" },
  { type: "icon", prompt: "Lightning bolt frozen in time" },
  { type: "icon", prompt: "Crystal tree growing from void" },
  { type: "icon", prompt: "Phoenix made of pure light" },
  { type: "icon", prompt: "Ocean of liquid time" },
  { type: "icon", prompt: "Mountain of condensed silence" },
  { type: "icon", prompt: "Star being born from wonder" },
  { type: "icon", prompt: "Bridge made of mystery and light" },
  // Scene backgrounds
  { type: "scene", prompt: "Vast cosmic void with distant galaxies" },
  { type: "scene", prompt: "Nebula nursery where stars are born" },
  { type: "scene", prompt: "Ancient temple floating in space" },
  { type: "scene", prompt: "Crystalline cavern with glowing minerals" },
  { type: "scene", prompt: "Ocean of liquid starlight" },
  { type: "scene", prompt: "Forest of light beams" },
  { type: "scene", prompt: "Desert of time, hourglasses as dunes" },
  { type: "scene", prompt: "City built on clouds of mystery" },
  { type: "scene", prompt: "Garden of primordial elements" },
  { type: "scene", prompt: "Throne room of the cosmos" },
];

interface ImagenTestResults {
  timestamp: string;
  model: string;
  numTests: number;
  stats: LatencyStats;
  samples: Array<{
    prompt: string;
    type: string;
    result: ImageGenerationResponse;
  }>;
  verdict: {
    passed: boolean;
    p95Target: number;
    p95Actual: number;
    successRateTarget: number;
    successRateActual: number;
  };
  imagesDirectory: string;
}

async function runTest(): Promise<void> {
  const modelName = IMAGE_MODEL === "gemini" ? "Gemini 2.5 Flash Image" : "Imagen 4";

  console.log(`🎨 ${modelName} API Benchmark`);
  console.log("================================");
  console.log(`Running ${NUM_TESTS} image generation tests...\n`);

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("❌ Error: Please set your GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  // Create client based on config
  const client =
    IMAGE_MODEL === "gemini" ? new GeminiImageClient(API_KEY) : new Imagen4Client(API_KEY);

  const results: Array<{
    prompt: string;
    type: string;
    result: ImageGenerationResponse;
  }> = [];
  const latencies: number[] = [];

  // Ensure images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Run tests
  for (let i = 0; i < NUM_TESTS; i++) {
    const testCase = TEST_PROMPTS[i];
    const fullPrompt = client.getArtStylePrompt(testCase.prompt);
    process.stdout.write(
      `\r  Generating ${i + 1}/${NUM_TESTS}: ${testCase.prompt.substring(0, 40)}...`
    );

    const outputPath = path.join(IMAGES_DIR, `test_${i + 1}_${testCase.type}.png`);
    const result = await client.generateImage(fullPrompt, outputPath, {
      aspectRatio: "1:1",
      imageSize: "1K",
    });

    results.push({ prompt: testCase.prompt, type: testCase.type, result });

    if (result.success) {
      latencies.push(result.latencyMs);
    }

    // Delay to avoid rate limiting
    if (i < NUM_TESTS - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log("\n");

  // Calculate statistics
  const stats = calculateStats(latencies);
  stats.failureCount = results.filter((r) => !r.result.success).length;
  stats.successCount = results.filter((r) => r.result.success).length;
  stats.successRate = (stats.successCount / NUM_TESTS) * 100;

  printStats(stats, modelName);

  // Sample responses
  console.log("\n📝 Sample Results:");
  const successfulResults = results.filter((r) => r.result.success).slice(0, 5);
  for (const sample of successfulResults) {
    console.log(`   ✓ ${sample.prompt.substring(0, 50)}...`);
    console.log(`      Saved to: ${sample.result.imagePath}`);
  }

  // Failures
  const failures = results.filter((r) => !r.result.success);
  if (failures.length > 0) {
    console.log(`\n❌ Failures (${failures.length}):`);
    for (const fail of failures.slice(0, 5)) {
      console.log(`   ${fail.prompt.substring(0, 40)}...: ${fail.result.error}`);
    }
  }

  // Verdict
  const p95Target = 2000; // 2s
  const successRateTarget = 90;
  const passed = stats.p95 <= p95Target && stats.successRate >= successRateTarget;

  console.log("\n" + "=".repeat(50));
  if (passed) {
    console.log("✅ VERDICT: PASSED");
  } else {
    console.log("❌ VERDICT: FAILED");
  }
  console.log(
    `   p95: ${stats.p95}ms (target: <${p95Target}ms) ${stats.p95 <= p95Target ? "✓" : "✗"}`
  );
  console.log(
    `   Success rate: ${stats.successRate.toFixed(1)}% (target: >${successRateTarget}%) ${
      stats.successRate >= successRateTarget ? "✓" : "✗"
    }`
  );
  console.log("=".repeat(50));

  if (stats.successCount > 0) {
    console.log(`\n🖼️  Generated images saved to: ${IMAGES_DIR}`);
    console.log("   Please review the images manually for quality assessment.");
  }

  // Save results
  const testResults: ImagenTestResults = {
    timestamp: new Date().toISOString(),
    model: modelName,
    numTests: NUM_TESTS,
    stats,
    samples: results.slice(0, 10).map((r) => ({
      ...r,
      result: {
        ...r.result,
        imagePath: r.result.imagePath ? path.basename(r.result.imagePath) : undefined,
      },
    })),
    verdict: {
      passed,
      p95Target,
      p95Actual: stats.p95,
      successRateTarget,
      successRateActual: stats.successRate,
    },
    imagesDirectory: IMAGES_DIR,
  };

  // Ensure results directory exists
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const outputPath = path.join(RESULTS_DIR, "imagen-results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
}

runTest().catch(console.error);
