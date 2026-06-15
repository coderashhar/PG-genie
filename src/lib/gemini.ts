import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';

// ---------------------------------------------------------------------------
// Client Singleton
// ---------------------------------------------------------------------------

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  console.warn('[gemini] GOOGLE_GENERATIVE_AI_API_KEY is not set – AI features will be unavailable.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/** The model id to use across all AI features – configurable via env. */
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// ---------------------------------------------------------------------------
// System Prompt – PG Genie Chatbot
// ---------------------------------------------------------------------------

export const PG_GENIE_SYSTEM_PROMPT = `You are **PG Genie Assistant** — a friendly and knowledgeable AI helper built into the PG Genie platform. PG Genie helps students find Paying Guest (PG) accommodations near VIT University in Kothri, Bhopal.

## Your Expertise
- PG listings, pricing, amenities, and room types available in the Kothri area
- The booking process and visit scheduling on PG Genie
- Comparing PGs based on a student's budget, preferred amenities, and lifestyle
- Location guidance — distances from VIT campus, nearby landmarks, transport
- General PG-living tips for students (what to check before moving in, security deposits, etc.)

## Rules
1. **Stay on topic** — Only answer questions related to PGs, accommodation, student housing, or the PG Genie platform. If someone asks an unrelated question, politely say: "I'm your PG search assistant! I can help you find the perfect PG near VIT. Try asking about pricing, amenities, or locations."
2. **Use ₹ (INR)** for all prices.
3. **Be concise** — Keep answers short and scannable. Use bullet points for comparisons.
4. **Be warm and student-friendly** — Use a helpful, encouraging tone.
5. **Suggest actions** — When relevant, guide users to search/filter/book on the platform.
6. **Never make up listings** — If you don't have specific data, say you can help them search on the platform.
7. **Format nicely** — Use markdown for emphasis, lists, and structure.`;

// ---------------------------------------------------------------------------
// NL Search – Filter Schema
// ---------------------------------------------------------------------------

export interface ParsedSearchFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  gender?: string;
  sort?: string;
}

const NL_SEARCH_SYSTEM_PROMPT = `You are a search query parser for a PG (Paying Guest) accommodation platform in Kothri, Bhopal, India.

Your job is to extract structured filters from a natural language search query.

Available filters:
- search: free-text keyword (property name, landmark, etc.)
- city: city name (default: Kothri)
- minPrice: minimum monthly rent in ₹
- maxPrice: maximum monthly rent in ₹
- amenities: array of amenity keys from this list ONLY: ["WiFi", "Furniture", "AttachedBath", "WaterSupply", "Geyser", "BackupPower", "CCTV", "WashingMachine", "PetFriendly", "AC", "Laundry", "Meals", "Gym"]
- gender: one of "Boys", "Girls", "Co-ed"
- sort: one of "price_asc", "price_desc", "newest", "popular"

Rules:
- "cheap" or "budget" means maxPrice around 5000-6000
- "mid-range" means 6000-10000
- "premium" or "expensive" means minPrice 10000+
- "near campus" or "near VIT" means city: Kothri and sort: closest if available, otherwise keep default
- Map user language to exact amenity keys (e.g., "wifi" → "WiFi", "AC" → "AC", "food" or "mess" → "Meals", "washing machine" → "WashingMachine", "attached bathroom" → "AttachedBath")
- Only include filters that the user explicitly or implicitly mentions
- Return valid JSON only, no markdown or explanation`;

// ---------------------------------------------------------------------------
// Moderation Prompt
// ---------------------------------------------------------------------------

const MODERATION_TEXT_PROMPT = `You are a content moderation system for a PG (Paying Guest) accommodation listing platform.

Analyze the following property listing text and determine if it contains any inappropriate content:
- Sexually explicit or suggestive content
- Hate speech, discrimination, or offensive slurs
- Violent or threatening language
- Spam, scams, or misleading claims
- Contact information that bypasses the platform (phone numbers, WhatsApp links in descriptions)

Respond with JSON only:
{
  "safe": true/false,
  "flagged": true/false,
  "reason": "brief explanation if flagged, null if safe",
  "categories": {
    "sexually_explicit": false,
    "hate_speech": false,
    "violence": false,
    "spam": false,
    "contact_bypass": false
  }
}`;

// ---------------------------------------------------------------------------
// Helper: Ensure client is available
// ---------------------------------------------------------------------------

function getClient(): GoogleGenAI {
  if (!ai) {
    throw new Error('Gemini AI client is not initialised. Check GOOGLE_GENERATIVE_AI_API_KEY.');
  }
  return ai;
}

// ---------------------------------------------------------------------------
// 1. Chat Completion (Streaming)
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

/**
 * Stream a chat response from the PG Genie assistant.
 * Returns an async generator of text chunks.
 */
export async function chatWithPGGenie(
  messages: ChatMessage[],
  propertyContext?: string,
): Promise<AsyncGenerator<GenerateContentResponse>> {
  const client = getClient();

  // Build the contents array for multi-turn conversation
  const contents = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  let systemPrompt = PG_GENIE_SYSTEM_PROMPT;
  if (propertyContext) {
    systemPrompt += `\n\n## Current Property Data Context\n${propertyContext}`;
  }

  const stream = await client.models.generateContentStream({
    model: MODEL,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  return stream;
}

// ---------------------------------------------------------------------------
// 2. Natural Language Search Parsing
// ---------------------------------------------------------------------------

/**
 * Parse a natural language search query into structured filters.
 */
export async function parseNaturalLanguageSearch(
  query: string,
): Promise<{ filters: ParsedSearchFilters; interpretation: string }> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: `Parse this PG search query into structured filters:\n\n"${query}"`,
    config: {
      systemInstruction: NL_SEARCH_SYSTEM_PROMPT,
      temperature: 0.1,
      maxOutputTokens: 512,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text?.trim() || '{}';
  let filters: ParsedSearchFilters;

  try {
    filters = JSON.parse(text);
  } catch {
    // If JSON parsing fails, return a basic keyword search
    filters = { search: query };
  }

  // Build a human-readable interpretation
  const parts: string[] = [];
  if (filters.gender) parts.push(`${filters.gender} PGs`);
  else parts.push('PGs');

  if (filters.city) parts.push(`in ${filters.city}`);
  if (filters.maxPrice && filters.minPrice) {
    parts.push(`₹${filters.minPrice.toLocaleString('en-IN')} – ₹${filters.maxPrice.toLocaleString('en-IN')}`);
  } else if (filters.maxPrice) {
    parts.push(`under ₹${filters.maxPrice.toLocaleString('en-IN')}`);
  } else if (filters.minPrice) {
    parts.push(`above ₹${filters.minPrice.toLocaleString('en-IN')}`);
  }
  if (filters.amenities && filters.amenities.length > 0) {
    parts.push(`with ${filters.amenities.join(', ')}`);
  }

  const interpretation = `Showing ${parts.join(' ')}`;

  return { filters, interpretation };
}

// ---------------------------------------------------------------------------
// 3. Content Moderation
// ---------------------------------------------------------------------------

export interface ModerationResult {
  safe: boolean;
  flagged: boolean;
  reason?: string;
  categories?: Record<string, boolean>;
}

/**
 * Moderate text content (title + description) for a property listing.
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  const client = getClient();

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: `Moderate this PG listing text:\n\nTitle & Description:\n${text}`,
      config: {
        systemInstruction: MODERATION_TEXT_PROMPT,
        temperature: 0.1,
        maxOutputTokens: 256,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text?.trim() || '{}';
    const result = JSON.parse(resultText);
    return {
      safe: result.safe ?? true,
      flagged: result.flagged ?? false,
      reason: result.reason ?? undefined,
      categories: result.categories ?? {},
    };
  } catch (error) {
    console.error('[gemini] Text moderation error:', error);
    // Fail open — don't block legitimate listings due to AI errors
    return { safe: true, flagged: false, reason: undefined };
  }
}

/**
 * Moderate an image for a property listing.
 * Takes an image URL (S3), fetches it, and sends to Gemini for safety analysis.
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  const client = getClient();

  try {
    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType,
              },
            },
            {
              text: 'Analyze this image for a PG accommodation listing platform. Is this image appropriate for a property listing? Check for: sexually explicit content, violence, hate symbols, spam/watermarks, or anything inappropriate for a family-friendly accommodation platform.\n\nRespond with JSON only:\n{"safe": true/false, "flagged": true/false, "reason": "explanation if flagged, null if safe"}',
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 256,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text?.trim() || '{}';
    const result = JSON.parse(resultText);
    return {
      safe: result.safe ?? true,
      flagged: result.flagged ?? false,
      reason: result.reason ?? undefined,
    };
  } catch (error) {
    console.error('[gemini] Image moderation error:', error);
    // Fail open
    return { safe: true, flagged: false, reason: undefined };
  }
}

// ---------------------------------------------------------------------------
// Utility: Detect if a query is natural language vs keyword
// ---------------------------------------------------------------------------

/**
 * Heuristic to decide if a search query is natural language (needs AI parsing)
 * vs a simple keyword search.
 */
export function isNaturalLanguageQuery(query: string): boolean {
  const trimmed = query.trim();
  const words = trimmed.split(/\s+/);

  // Single word → keyword search
  if (words.length <= 2) return false;

  // Intent words that suggest NL
  const intentWords = [
    'find', 'show', 'search', 'looking', 'want', 'need',
    'near', 'close', 'around', 'nearby',
    'under', 'below', 'above', 'between', 'budget', 'cheap', 'affordable', 'premium', 'expensive',
    'with', 'without', 'having',
    'best', 'top', 'recommend', 'suggest',
    'boys', 'girls', 'male', 'female', 'coed', 'co-ed',
    'for', 'me', 'please',
  ];

  const lowerQuery = trimmed.toLowerCase();
  const matchCount = intentWords.filter((w) => lowerQuery.includes(w)).length;

  // If 2+ intent words detected, it's likely NL
  return matchCount >= 2 || words.length >= 4;
}
