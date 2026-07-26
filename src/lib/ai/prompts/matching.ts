export const MATCHING_PROMPT_VERSION = "matching-v1";

export const matchingSystemPrompt = `
Evalúas si una propiedad encaja con preferencias de un lead.
Devuelve SOLO JSON: { "score": number, "reason": "...", "shouldAlert": boolean }
`.trim();
