/**
 * Image Generation API clients
 *
 * Two options available:
 * 1. Imagen 4 - Standalone image generation model (recommended for quality)
 * 2. Gemini Image - Uses gemini-2.5-flash-image for generation
 *
 * Both require billing enabled on your Google Cloud project.
 */

import * as fs from "fs";
import * as path from "path";

export interface ImageGenerationResponse {
  success: boolean;
  latencyMs: number;
  imagePath?: string;
  error?: string;
  mimeType?: string;
  model?: string;
}

export interface ImagenConfig {
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageSize?: "1K" | "2K";
  numberOfImages?: number;
}

const DEFAULT_CONFIG: ImagenConfig = {
  aspectRatio: "1:1",
  imageSize: "1K",
  numberOfImages: 1,
};

// Cosmic art style for consistent aesthetic
const ART_STYLE_PREFIX =
  "A cosmic ethereal representation of {SUBJECT}, glowing with inner light, floating in a dark void with subtle nebula colors, mystical and ancient, game icon style, centered composition, high detail, digital art";

/**
 * Imagen 4 Client - Uses the :predict endpoint
 * Model: imagen-4.0-generate-001
 */
export class Imagen4Client {
  private apiKey: string;
  private model = "imagen-4.0-generate-001";
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    if (model) this.model = model;
  }

  async generateImage(
    prompt: string,
    outputPath: string,
    config: Partial<ImagenConfig> = {}
  ): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    const { aspectRatio, imageSize, numberOfImages } = { ...DEFAULT_CONFIG, ...config };

    try {
      const url = `${this.baseUrl}/${this.model}:predict?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            numberOfImages: numberOfImages,
            aspectRatio: aspectRatio,
            imageSize: imageSize,
          },
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          latencyMs,
          error: `API error ${response.status}: ${errorText}`,
          model: this.model,
        };
      }

      const data = (await response.json()) as {
        predictions?: Array<{
          bytesBase64Encoded: string;
          mimeType: string;
        }>;
        error?: { message: string };
      };

      if (data.error) {
        return {
          success: false,
          latencyMs,
          error: data.error.message,
          model: this.model,
        };
      }

      if (!data.predictions || data.predictions.length === 0) {
        return {
          success: false,
          latencyMs,
          error: "No predictions in response",
          model: this.model,
        };
      }

      // Get the first prediction
      const prediction = data.predictions[0];
      const imageData = prediction.bytesBase64Encoded;
      const mimeType = prediction.mimeType || "image/png";

      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save the image
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(outputPath, buffer);

      return {
        success: true,
        latencyMs,
        imagePath: outputPath,
        mimeType,
        model: this.model,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        error: error instanceof Error ? error.message : String(error),
        model: this.model,
      };
    }
  }

  getArtStylePrompt(subject: string): string {
    return ART_STYLE_PREFIX.replace("{SUBJECT}", subject);
  }
}

/**
 * Gemini Image Client - Uses gemini-2.5-flash-image with :generateContent endpoint
 * Faster and cheaper than Imagen 4, good for prototyping
 */
export class GeminiImageClient {
  private apiKey: string;
  private model = "gemini-2.5-flash-image";
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    if (model) this.model = model;
  }

  async generateImage(
    prompt: string,
    outputPath: string,
    config: Partial<ImagenConfig> = {}
  ): Promise<ImageGenerationResponse> {
    const startTime = Date.now();

    try {
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
            responseMimeType: "image/png",
          },
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          latencyMs,
          error: `API error ${response.status}: ${errorText}`,
          model: this.model,
        };
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{
              inlineData?: {
                mimeType: string;
                data: string;
              };
              text?: string;
            }>;
          };
        }>;
        error?: { message: string };
      };

      if (data.error) {
        return {
          success: false,
          latencyMs,
          error: data.error.message,
          model: this.model,
        };
      }

      // Find the image part in the response
      const candidate = data.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const imagePart = parts.find((p) => p.inlineData);

      if (!imagePart?.inlineData) {
        return {
          success: false,
          latencyMs,
          error: "No image data in response",
          model: this.model,
        };
      }

      const imageData = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || "image/png";

      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save the image
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(outputPath, buffer);

      return {
        success: true,
        latencyMs,
        imagePath: outputPath,
        mimeType,
        model: this.model,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        error: error instanceof Error ? error.message : String(error),
        model: this.model,
      };
    }
  }

  getArtStylePrompt(subject: string): string {
    return ART_STYLE_PREFIX.replace("{SUBJECT}", subject);
  }
}

// Default export - use Imagen 4 for best quality
export const ImagenClient = Imagen4Client;
