/**
 * Gemini Flash API Benchmark
 * Tests 50 combination calls to validate latency and quality
 *
 * Target: p95 < 1.5s
 * Kill threshold: p95 > 2s
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { GeminiClient, PRIMORDIALS, CombinationResponse } from "./utils/gemini-client.js";
import { calculateStats, printStats, LatencyStats } from "./utils/stats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY;
const NUM_TESTS = 50;
const RESULTS_DIR = path.join(__dirname, "..", "outputs", "results");

interface FlashTestResults {
  timestamp: string;
  numTests: number;
  stats: LatencyStats;
  samples: Array<{
    element1: string;
    element2: string;
    result: CombinationResponse;
  }>;
  verdict: {
    passed: boolean;
    p95Target: number;
    p95Actual: number;
    successRateTarget: number;
    successRateActual: number;
  };
}

async function runTest(): Promise<void> {
  console.log("🚀 Gemini Flash API Benchmark");
  console.log("================================");
  console.log(`Running ${NUM_TESTS} combination tests...\n`);

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("❌ Error: Please set your GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  const client = new GeminiClient(API_KEY);
  const results: Array<{
    element1: string;
    element2: string;
    result: CombinationResponse;
  }> = [];
  const latencies: number[] = [];

  // Generate all test pairs first
  const testPairs: [string, string][] = [];
  for (let i = 0; i < NUM_TESTS; i++) {
    testPairs.push(client.getRandomPair());
  }

  // Run tests
  for (let i = 0; i < NUM_TESTS; i++) {
    const [e1, e2] = testPairs[i];
    process.stdout.write(`\r  Testing ${i + 1}/${NUM_TESTS}: ${e1} + ${e2}...`);

    const result = await client.combine(e1, e2);
    results.push({ element1: e1, element2: e2, result });

    if (result.success) {
      latencies.push(result.latencyMs);
    }

    // Small delay to avoid rate limiting
    if (i < NUM_TESTS - 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log("\n");

  // Calculate statistics
  const stats = calculateStats(latencies);
  stats.failureCount = results.filter((r) => !r.result.success).length;
  stats.successCount = results.filter((r) => r.result.success).length;
  stats.successRate = (stats.successCount / NUM_TESTS) * 100;

  printStats(stats, "Gemini Flash");

  // Sample responses
  console.log("\n📝 Sample Responses:");
  const successfulResults = results.filter((r) => r.result.success).slice(0, 5);
  for (const sample of successfulResults) {
    console.log(
      `   ${sample.element1} + ${sample.element2} = ${sample.result.result?.emoji} ${sample.result.result?.name}`
    );
    console.log(`      "${sample.result.result?.description}"`);
  }

  // Failures
  const failures = results.filter((r) => !r.result.success);
  if (failures.length > 0) {
    console.log(`\n❌ Failures (${failures.length}):`);
    for (const fail of failures.slice(0, 3)) {
      console.log(`   ${fail.element1} + ${fail.element2}: ${fail.result.error}`);
    }
  }

  // Verdict
  const p95Target = 1500; // 1.5s
  const successRateTarget = 95;
  const passed = stats.p95 <= p95Target && stats.successRate >= successRateTarget;

  console.log("\n" + "=".repeat(50));
  if (passed) {
    console.log("✅ VERDICT: PASSED");
  } else {
    console.log("❌ VERDICT: FAILED");
  }
  console.log(`   p95: ${stats.p95}ms (target: <${p95Target}ms) ${stats.p95 <= p95Target ? "✓" : "✗"}`);
  console.log(
    `   Success rate: ${stats.successRate.toFixed(1)}% (target: >${successRateTarget}%) ${
      stats.successRate >= successRateTarget ? "✓" : "✗"
    }`
  );
  console.log("=".repeat(50));

  // Save results
  const testResults: FlashTestResults = {
    timestamp: new Date().toISOString(),
    numTests: NUM_TESTS,
    stats,
    samples: results.slice(0, 10), // Save first 10 for review
    verdict: {
      passed,
      p95Target,
      p95Actual: stats.p95,
      successRateTarget,
      successRateActual: stats.successRate,
    },
  };

  // Ensure results directory exists
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const outputPath = path.join(RESULTS_DIR, "flash-results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
}

runTest().catch(console.error);
