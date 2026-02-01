/**
 * Veo Video Generation Test
 * Uses the correct predictLongRunning pattern for video generation
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, "..", ".env.local") });

const API_KEY = process.env.GEMINI_API_KEY!;
const OUTPUT_DIR = path.join(__dirname, "..", "outputs", "veo-test");

async function generateVideo(): Promise<void> {
  console.log("🎬 Veo Video Generation Test");
  console.log("=============================\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Use veo-3.1-fast-generate-preview for faster results
  const model = "veo-3.1-fast-generate-preview";
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  console.log(`Using model: ${model}`);
  console.log("Prompt: A cosmic nebula slowly rotating with stars twinkling\n");

  // Step 1: Start the video generation job
  console.log("⏳ Starting video generation job...");

  try {
    // Correct format without numberOfVideos
    const startResponse = await fetch(
      `${baseUrl}/models/${model}:predictLongRunning?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [
            {
              prompt: "A cosmic nebula slowly rotating with stars twinkling, ethereal and mystical, cinematic lighting, 8K quality"
            }
          ],
          parameters: {
            aspectRatio: "16:9"
          }
        })
      }
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.log(`❌ Failed to start job: ${startResponse.status}`);
      console.log(`   Response: ${errorText}`);

      // Parse the error to get more details
      try {
        const errorJson = JSON.parse(errorText);
        console.log(`\n   Error message: ${errorJson.error?.message}`);
      } catch {}

      return;
    }

    const jobData = await startResponse.json();
    console.log("✅ Job started successfully!");
    console.log(`   Job data: ${JSON.stringify(jobData, null, 2).substring(0, 500)}`);

    // Step 2: Poll for completion
    const operationName = jobData.name;

    if (!operationName) {
      console.log("⚠️ No operation name returned - job may have completed immediately");
      console.log(`   Full response: ${JSON.stringify(jobData, null, 2)}`);
      return;
    }

    console.log(`\n⏳ Polling for completion...`);
    console.log(`   Operation: ${operationName}`);
    console.log("   (This may take 1-5 minutes)\n");

    let completed = false;
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes with 5-second intervals

    while (!completed && attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
      attempts++;

      const statusResponse = await fetch(
        `${baseUrl}/${operationName}?key=${API_KEY}`
      );

      if (!statusResponse.ok) {
        console.log(`   Poll attempt ${attempts}: Status check failed (${statusResponse.status})`);
        continue;
      }

      const status = await statusResponse.json();

      if (status.done) {
        completed = true;
        console.log(`\n✅ Video generation complete!`);

        if (status.response) {
          console.log("\n📽️ Response:");
          console.log(JSON.stringify(status.response, null, 2));

          // Save the response
          const responsePath = path.join(OUTPUT_DIR, "veo-response.json");
          fs.writeFileSync(responsePath, JSON.stringify(status.response, null, 2));
          console.log(`\n💾 Response saved to: ${responsePath}`);

          // Try to extract video
          if (status.response.predictions) {
            for (const pred of status.response.predictions) {
              if (pred.bytesBase64Encoded) {
                const videoBuffer = Buffer.from(pred.bytesBase64Encoded, 'base64');
                const videoPath = path.join(OUTPUT_DIR, "test-video.mp4");
                fs.writeFileSync(videoPath, videoBuffer);
                console.log(`\n🎬 Video saved to: ${videoPath}`);
              }
              if (pred.uri) {
                console.log(`\n🎬 Video URI: ${pred.uri}`);
              }
            }
          }
        }

        if (status.error) {
          console.log(`\n❌ Generation error: ${status.error.message}`);
        }
      } else {
        const metadata = status.metadata || {};
        process.stdout.write(`\r   Waiting... (attempt ${attempts}/${maxAttempts})   `);
      }
    }

    if (!completed) {
      console.log("\n⚠️ Timed out waiting for video generation");
      console.log("   The job may still complete - check the operation manually");
      console.log(`   Operation: ${operationName}`);
    }

  } catch (error: any) {
    console.log(`\n❌ Error: ${error.message}`);
    console.log(error.stack);
  }

  console.log("\n" + "=".repeat(50));
  console.log("📋 Summary:");
  console.log("   If video generation works, Evolution feature is GO!");
  console.log("   Videos can be pre-generated for the demo.");
  console.log("=".repeat(50));
}

generateVideo().catch(console.error);
