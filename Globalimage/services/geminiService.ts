
import { GoogleGenAI, Type } from "@google/genai";

// Use the standard process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeImage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image
            }
          },
          {
            text: "Analyze this candidate's entry photo for a photography contest. Provide a creative critique (max 3 sentences), a 'Vibe Score' (0-100), and 3 relevant hashtags. Format as JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING },
            vibeScore: { type: Type.NUMBER },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["critique", "vibeScore", "tags"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      critique: "A striking and memorable image.",
      vibeScore: 85,
      tags: ["Creative", "Photography", "VisualStory"]
    };
  }
}
