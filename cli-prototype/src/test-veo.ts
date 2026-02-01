/**
 * Veo 3.1 Accessibility Check
 * Tests if Veo video generation API is available
 *
 * Decision:
 * - If accessible: Keep Evolution feature (P2)
 * - If not accessible: Cut Evolution completely
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY;
const RESULTS_DIR = path.join(__dirname, "..", "outputs", "results");

interface VeoTestResults {
  timestamp: string;
  accessible: boolean;
  endpoint: string;
  error?: string;
  statusCode?: number;
  responseBody?: string;
  recommendation: string;
}

async function checkVeoAccess(): Promise<void> {
  console.log("🎬 Veo 3.1 Accessibility Check");
  console.log("================================\n");

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("❌ Error: Please set your GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  // Try different potential Veo endpoints
  const endpoints = [
    // Possible AI Studio endpoints
    "https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predict",
    "https://generativelanguage.googleapis.com/v1beta/models/veo-001:generateVideo",
    "https://generativelanguage.googleapis.com/v1/models/veo:generateVideo",
    // Possible Vertex AI style endpoints
    "https://us-central1-aiplatform.googleapis.com/v1/projects/*/locations/us-central1/publishers/google/models/veo-001:predict",
  ];

  const testPrompt = {
    instances: [
      {
        prompt: "A cosmic nebula slowly rotating, ethereal and mystical, 3 seconds",
      },
    ],
    parameters: {
      duration: 3,
    },
  };

  let accessible = false;
  let lastError = "";
  let lastStatusCode = 0;
  let lastResponseBody = "";
  let testedEndpoint = "";

  console.log("Testing Veo API accessibility...\n");

  for (const endpoint of endpoints) {
    const url = `${endpoint}?key=${API_KEY}`;
    testedEndpoint = endpoint;

    console.log(`  Testing: ${endpoint.substring(0, 60)}...`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPrompt),
      });

      lastStatusCode = response.status;
      lastResponseBody = await response.text();

      if (response.status === 200) {
        console.log(`  ✓ Status: ${response.status} - Accessible!`);
        accessible = true;
        break;
      } else if (response.status === 404) {
        console.log(`  ✗ Status: 404 - Not Found`);
        lastError = "Endpoint not found (404)";
      } else if (response.status === 403) {
        console.log(`  ✗ Status: 403 - Forbidden (API not enabled or no access)`);
        lastError = "Access forbidden (403) - Veo likely not available in free tier";
      } else if (response.status === 400) {
        // 400 might mean the endpoint exists but our request format is wrong
        // This could indicate the API is accessible
        console.log(`  ? Status: 400 - Bad Request (endpoint exists, format may be wrong)`);
        lastError = `Bad request (400) - ${lastResponseBody.substring(0, 100)}`;
        // Could potentially be accessible with correct format
        if (lastResponseBody.includes("video") || lastResponseBody.includes("veo")) {
          accessible = true;
          break;
        }
      } else {
        console.log(`  ✗ Status: ${response.status}`);
        lastError = `HTTP ${response.status}: ${lastResponseBody.substring(0, 100)}`;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.log(`  ✗ Error: ${lastError}`);
    }
  }

  // Decision
  console.log("\n" + "=".repeat(50));
  if (accessible) {
    console.log("✅ VEO STATUS: ACCESSIBLE");
    console.log("   Recommendation: Keep Evolution feature (P2)");
    console.log("   Next step: Test actual video generation");
  } else {
    console.log("❌ VEO STATUS: NOT ACCESSIBLE");
    console.log("   Recommendation: CUT Evolution feature");
    console.log("   Focus resources on Combine + Zoom mechanics");
  }
  console.log("=".repeat(50));

  // Additional notes
  console.log("\n📋 Notes:");
  console.log("   - Veo is typically only available through Vertex AI with billing enabled");
  console.log("   - AI Studio (free tier) usually does not include Veo access");
  console.log("   - If Evolution is critical, consider Vertex AI setup");

  // Save results
  const testResults: VeoTestResults = {
    timestamp: new Date().toISOString(),
    accessible,
    endpoint: testedEndpoint,
    error: accessible ? undefined : lastError,
    statusCode: lastStatusCode,
    responseBody: lastResponseBody.substring(0, 500),
    recommendation: accessible
      ? "Keep Evolution feature (P2)"
      : "Cut Evolution feature, focus on Combine + Zoom",
  };

  // Ensure results directory exists
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const outputPath = path.join(RESULTS_DIR, "veo-results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
}

checkVeoAccess().catch(console.error);
