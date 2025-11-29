import { GoogleGenAI } from "@google/genai";
import { StickerTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a specialized Sticker Generation AI.
Your task is to generate prompts for an image generation model to create high-quality, die-cut stickers.
Ensure the subject is isolated on a pure white background.
The style should be distinct, with bold lines and vibrant colors typical of stickers.
Add a white border outline (die-cut) around the subject.
`;

export const generateStickerImage = async (prompt: string, theme: StickerTheme): Promise<string> => {
  try {
    // We construct a specific prompt to ensure "Sticker" aesthetic
    const enhancedPrompt = `
      A high-quality, vector-style die-cut sticker of ${prompt}. 
      Style: ${theme}. 
      Features: Clean thick white border surrounding the subject, isolated on a pure white background, flat 2D vector art or high-quality illustration depending on style, no shadows on the background, bold colors.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: enhancedPrompt }
        ]
      },
      config: {
        // We do not set responseMimeType for image models unless we want JSON, which we don't here.
        // The model returns an image part.
      }
    });

    // Parse the response to find the image data
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};