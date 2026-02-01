/**
 * Veo 3.1 Test for Paid Tier
 * Tests video generation using the Generative AI SDK
 */

import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY;

async function testVeo(): Promise<void> {
  console.log("🎬 Veo Video Generation Test (Paid Tier)");
  console.log("=========================================\n");

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("❌ Error: Please set your GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  // List available models first to see what's available
  console.log("📋 Checking available models...\n");

  try {
    // Try to list models to see what's available
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const data = await response.json();

    if (data.models) {
      console.log("Available models:");
      const videoModels = data.models.filter((m: any) =>
        m.name.includes('veo') ||
        m.name.includes('video') ||
        m.supportedGenerationMethods?.includes('generateVideo')
      );

      if (videoModels.length > 0) {
        console.log("\n🎬 Video generation models found:");
        videoModels.forEach((m: any) => {
          console.log(`   - ${m.name}`);
          console.log(`     Methods: ${m.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        });
      } else {
        console.log("\n⚠️  No video models found in available models list.");
        console.log("   This doesn't mean Veo isn't available - it may use a different endpoint.");
      }

      // Also show all model names for reference
      console.log("\n📌 All available models:");
      data.models.forEach((m: any) => {
        if (m.name.includes('gemini') || m.name.includes('imagen') || m.name.includes('veo')) {
          console.log(`   - ${m.name}`);
        }
      });
    }
  } catch (error) {
    console.log("Could not list models:", error);
  }

  // Try different Veo model names
  const veoModels = [
    "veo-2.0-generate-001",
    "veo-001",
    "veo",
    "models/veo-2.0-generate-001",
  ];

  console.log("\n\n🔄 Testing Veo video generation...\n");

  for (const modelName of veoModels) {
    console.log(`Testing model: ${modelName}`);

    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      // Try to generate content (this will fail differently based on model availability)
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: "Generate a 3 second video of a cosmic nebula rotating slowly" }]
        }]
      });

      console.log(`  ✅ Model responded!`);
      console.log(`  Response: ${result.response.text().substring(0, 200)}`);

    } catch (error: any) {
      if (error.message?.includes("not found") || error.message?.includes("404")) {
        console.log(`  ❌ Model not found`);
      } else if (error.message?.includes("not supported")) {
        console.log(`  ❌ Method not supported for this model`);
      } else if (error.message?.includes("permission") || error.message?.includes("403")) {
        console.log(`  ❌ No permission to access this model`);
      } else {
        console.log(`  ❌ Error: ${error.message?.substring(0, 100)}`);
      }
    }
  }

  // Try the REST API directly with different endpoints
  console.log("\n\n🔄 Testing REST API endpoints...\n");

  const restEndpoints = [
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:generateVideo?key=${API_KEY}`,
      body: { prompt: "A cosmic nebula rotating", durationSeconds: 3 }
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`,
      body: { instances: [{ prompt: "test" }] }
    }
  ];

  for (const endpoint of restEndpoints) {
    console.log(`Testing: ${endpoint.url.split('?')[0].split('/').slice(-1)[0]}`);

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint.body)
      });

      const text = await response.text();
      console.log(`  Status: ${response.status}`);

      if (response.status === 200) {
        console.log(`  ✅ Endpoint accessible!`);
      } else {
        console.log(`  Response: ${text.substring(0, 150)}`);
      }
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📋 Summary:");
  console.log("   If no Veo endpoints worked, Evolution feature should be cut.");
  console.log("   Imagen is confirmed working from earlier tests.");
  console.log("   Focus on Combine + Zoom as the core experience.");
  console.log("=".repeat(50));
}

testVeo().catch(console.error);
