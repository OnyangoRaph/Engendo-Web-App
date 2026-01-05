
import { GoogleGenAI, Type } from "@google/genai";
import { TripPlan, BudgetEstimate } from "../types";

// Always use process.env.API_KEY directly as required by guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTripPlan = async (destination: string, interests: string[], duration: string): Promise<TripPlan> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plan a trip to ${destination} for ${duration}. Interests: ${interests.join(', ')}. Return details including a daily itinerary.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          duration: { type: Type.STRING },
          activities: { type: Type.ARRAY, items: { type: Type.STRING } },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                schedule: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        },
        required: ["destination", "duration", "activities", "itinerary"]
      }
    }
  });
  // Use .text property to access content directly
  return JSON.parse(response.text || '{}');
};

export const estimateBudget = async (destination: string, travelers: number, style: string): Promise<BudgetEstimate> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Estimate a travel budget for ${travelers} people going to ${destination} with a ${style} budget style.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          total: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              flights: { type: Type.NUMBER },
              accommodation: { type: Type.NUMBER },
              food: { type: Type.NUMBER },
              activities: { type: Type.NUMBER },
              transport: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });
  // Use .text property to access content directly
  return JSON.parse(response.text || '{}');
};

export const findNearbyPlaces = async (lat: number, lng: number, interests: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What are some interesting places to visit near my location (Lat: ${lat}, Lng: ${lng}) that match interests like ${interests.join(', ')}? Provide descriptions and why they are recommended.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    }
  });
  
  // Extract and filter maps grounding chunks for the UI, ensuring only valid references are returned
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map(chunk => chunk.maps)
    .filter(Boolean) || [];
    
  return {
    text: response.text,
    sources
  };
};
