export const LEADS_PROMPT_VERSION = "leads-v1";

export const leadSummarySystemPrompt = `
Resume y puntúa leads inmobiliarios para el equipo de MontePego Life.
Puntuación 0-100 según claridad de intención, presupuesto y seriedad aparente.
Devuelve SOLO JSON: { "summary": "...", "score": number }
`.trim();
