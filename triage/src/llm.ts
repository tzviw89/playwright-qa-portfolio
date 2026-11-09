import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

/** Structured output for failures the rules left open. */
export const classificationResponseSchema = z.object({
  items: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      label: z.enum(["flaky", "product bug", "test bug"]),
      confidence: z.number().min(0).max(1),
      reason: z.string().min(1),
    }),
  ),
});

export type ClassificationResponse = z.infer<typeof classificationResponseSchema>;

/** What a provider must implement. Tests pass a fake model here. */
export interface ClassifierModel {
  withStructuredOutput(schema: typeof classificationResponseSchema): {
    invoke(input: string): Promise<unknown>;
  };
}

const DEFAULT_MODEL = "gpt-4o-mini";

/** The only place a chat model is constructed. Swap the body to change provider. */
export function createChatModel(modelName = DEFAULT_MODEL): ClassifierModel {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  const chat = new ChatOpenAI({ model: modelName, apiKey, temperature: 0 });
  return {
    withStructuredOutput(schema) {
      const runnable = chat.withStructuredOutput(schema);
      return {
        invoke: (input: string) => runnable.invoke(input) as Promise<unknown>,
      };
    },
  };
}
