import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = "You are a strict data extraction engine. You strictly process the provided input (image or text) and output a JSON array of menu items. \n\nCRITICAL RULES:\n1. ONLY extract items explicitly visible or listed in the source.\n2. DO NOT invent, guess, or hallucinate dishes.\n3. DO NOT use your internal knowledge to add items (e.g., do not add 'Tiramisu' just because it's an Italian restaurant, unless 'Tiramisu' is in the source).\n4. If the source text is empty or unrelated, return an empty array.\n5. Copy prices exactly as shown.";

const MENU_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      price: { type: Type.STRING },
      tags: {
        type: Type.OBJECT,
        properties: {
          course: { type: Type.STRING, enum: ['starter', 'main', 'dessert', 'drink', 'side', 'unknown'] },
          protein: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          spiciness: { type: Type.STRING, enum: ['none', 'mild', 'medium', 'hot'] },
          dietary: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
        },
        required: ['course', 'protein', 'spiciness', 'dietary']
      },
    },
    required: ['name', 'description', 'price', 'tags'],
  },
};

export const parseMenuFromImage = async (base64Image: string, mimeType: string): Promise<MenuItem[]> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: `Extract all menu items VISIBLE in this image. 
            
            Strict Mode Instructions:
            1. ONLY extract items that are explicitly written in the image text. 
            2. DO NOT hallucinate or add items from your internal knowledge base.
            3. If a price is not visible, leave it empty.
            4. For each extracted item, infer the course type, protein, cuisine, spiciness level, and dietary info based on the name and description found in the image.
            5. If you are unsure if text is a dish, do NOT include it.
            `
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: MENU_SCHEMA,
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsedData = JSON.parse(text);
    return parsedData.map((item: any, index: number) => ({
      ...item,
      id: `menu-item-${index}-${Date.now()}`
    }));

  } catch (error) {
    console.error("Error parsing menu image:", error);
    throw error;
  }
};

/**
 * Parses menu from text or URL. 
 * If URL is detected, uses Google Search tool to fetch content first.
 */
export const parseMenuFromText = async (textInput: string): Promise<MenuItem[]> => {
  const ai = getAiClient();
  const isUrl = /^(http|https|www\.)[^ "]+$/.test(textInput.trim());
  
  try {
    let contentToParse = textInput;

    // Step 1: If URL, use Search to get content
    if (isUrl) {
      console.log("URL detected, performing search...");
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [{
            text: `Find the official food menu for this restaurant URL: ${textInput}. 
                   Retrieve the complete list of available dishes, descriptions, and prices.
                   IMPORTANT: 
                   - Focus strictly on the menu section.
                   - Do not summarize. Return the raw menu text found.
                   - Do not include items from "People also search for" or reviews.
                   - If the menu is not directly available, state that no menu was found.`
          }]
        },
        config: {
          tools: [{ googleSearch: {} }] // Use search tool
        }
      });
      
      contentToParse = searchResponse.text || "";
      console.log("Search result length:", contentToParse.length);
      
      // Safety check: if search result is short or empty
      if (!contentToParse || contentToParse.length < 50) {
         console.warn("Search result too short, might have failed to find menu.");
      }
    }

    // Step 2: Extract structured JSON from the text content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `Extract structured menu items STRICTLY from the provided Source Text below.
            
            Source Text:
            ----------------
            ${contentToParse}
            ----------------
            
            Strict Instructions:
            1. ONLY list items that are explicitly present in the Source Text above.
            2. Do NOT add dishes from your internal knowledge base (e.g. do not add "Pizza" if it's not in the text).
            3. Do NOT include headers, footers, or navigation links as dish names.
            4. Parse dishes, descriptions, and prices.
            5. Infer course, protein, cuisine, spiciness, and dietary tags based on the item details.
            6. If the Source Text contains no menu items, return an empty array.
            `
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: MENU_SCHEMA,
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    const text = response.text;
    if (!text) return [];

    const parsedData = JSON.parse(text);
    return parsedData.map((item: any, index: number) => ({
      ...item,
      id: `menu-item-${index}-${Date.now()}`
    }));

  } catch (error) {
    console.error("Error parsing menu text:", error);
    throw error;
  }
};