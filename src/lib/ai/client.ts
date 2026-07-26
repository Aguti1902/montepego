import Anthropic from "@anthropic-ai/sdk";
import { getDb } from "@/lib/db";
import { aiUsageLogs } from "@/lib/db/schema";

export const AI_MODEL = "claude-sonnet-4-6";

const memoryUsage: Array<{
  module: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: string;
  createdAt: Date;
}> = [];

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

/** Estimación orientativa USD para registro de coste */
export function estimateCostUsd(inputTokens: number, outputTokens: number) {
  const input = (inputTokens / 1_000_000) * 3;
  const output = (outputTokens / 1_000_000) * 15;
  return (input + output).toFixed(6);
}

export async function logAiUsage(input: {
  module: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  createdBy?: string;
}) {
  const model = input.model ?? AI_MODEL;
  const inputTokens = input.inputTokens ?? 0;
  const outputTokens = input.outputTokens ?? 0;
  const costUsd = estimateCostUsd(inputTokens, outputTokens);

  if (!process.env.DATABASE_URL) {
    memoryUsage.push({
      module: input.module,
      model,
      inputTokens,
      outputTokens,
      costUsd,
      createdAt: new Date(),
    });
    return { costUsd, memory: true as const };
  }

  const db = getDb();
  await db.insert(aiUsageLogs).values({
    module: input.module,
    model,
    inputTokens,
    outputTokens,
    costUsd,
    createdBy: input.createdBy,
  });

  return { costUsd, memory: false as const };
}

export function getMemoryAiUsage() {
  return memoryUsage;
}

export async function completeJson<T>(input: {
  module: string;
  system: string;
  user: string;
  fallback: T;
}): Promise<{ data: T; costUsd: string; mocked: boolean }> {
  const client = getAnthropicClient();

  if (!client) {
    await logAiUsage({
      module: input.module,
      inputTokens: 0,
      outputTokens: 0,
    });
    return { data: input.fallback, costUsd: "0", mocked: true };
  }

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 2000,
    system: input.system,
    messages: [{ role: "user", content: input.user }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const usage = await logAiUsage({
    module: input.module,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  });

  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as T;
    return { data: parsed, costUsd: usage.costUsd, mocked: false };
  } catch {
    return { data: input.fallback, costUsd: usage.costUsd, mocked: false };
  }
}
