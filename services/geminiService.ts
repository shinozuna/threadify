import { GoogleGenAI, Type } from "@google/genai";
import { AIDesignSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using Gemini based on a prompt.
 */
export const generateDesignImage = async (prompt: string, isMockup: boolean = false): Promise<string | null> => {
  try {
    const systemPrompt = isMockup 
      ? `High-end professional fashion photography of ${prompt}. Clean studio setting, minimalist aesthetic, high-resolution textile detail. No humans, just the garment.`
      : `Minimalist professional graphic design for apparel. Subject: ${prompt}. Simple, bold, high-contrast, suitable for printing. Transparent or solid background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: systemPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: isMockup ? "3:4" : "1:1",
        },
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};

/**
 * Generates creative design suggestions based on a theme.
 */
export const getDesignSuggestions = async (theme: string): Promise<AIDesignSuggestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 unique apparel design concepts for a streetwear brand based on the theme: "${theme}". 
      Each concept must include:
      1. A catchy short slogan/text.
      2. A descriptive prompt for an AI image generator to create a matching graphic.
      3. A font style recommendation (choose from: Inter, Space Grotesk, Bebas Neue, Oswald, Pacifico, Righteous, Permanent Marker, Bangers, Unifraktur).
      4. A brief description of the theme.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              fontName: { type: Type.STRING },
              themeDescription: { type: Type.STRING },
            },
            required: ["text", "imagePrompt", "fontName", "themeDescription"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};