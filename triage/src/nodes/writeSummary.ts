import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Classification, Failure, TriageState } from "../state.ts";

function excerpt(message: string): string {
  const flat = message.replace(/\s+/g, " ").trim();
  return flat.length > 400 ? `${flat.slice(0, 400)}…` : flat;
}

export function renderSummary(
  failures: Failure[],
  classifications: Classification[],
  llmUsed: boolean,
): string {
  const lines = [
    "# Triage summary",
    "",
    "Labels are suggestions. Rules run first. A model is asked only about failures the rules leave open, and only when OPENAI_API_KEY is set.",
    "",
    `- Model called: ${llmUsed ? "yes" : "no"}`,
    `- Failures: ${failures.length}`,
    "",
  ];
  if (failures.length === 0) {
    lines.push("No failed tests, and no tests passed on retry.", "");
    return lines.join("\n");
  }
  failures.forEach((failure, index) => {
    const item = classifications[index] ?? {
      label: "unresolved" as const,
      confidence: 0,
      reason: "No rule matched.",
    };
    const where = failure.project ? `${failure.project} — ${failure.title}` : failure.title;
    lines.push(
      `## ${where}`,
      "",
      `- Label: ${item.label} (suggestion, confidence ${item.confidence})`,
      `- Reason: ${item.reason}`,
      `- Retries: ${failure.retryCount}`,
      `- Passed on retry: ${failure.passedOnRetry ? "yes" : "no"}`,
      `- Error: ${excerpt(failure.errorMessage)}`,
      "",
    );
  });
  return lines.join("\n");
}

export async function writeSummary(state: TriageState): Promise<Partial<TriageState>> {
  const summary = renderSummary(state.failures, state.classifications, state.llmUsed);
  const directory = path.dirname(state.summaryPath);
  if (directory && directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(state.summaryPath, summary, "utf8");
  const stepSummary = process.env.GITHUB_STEP_SUMMARY?.trim();
  if (stepSummary) await appendFile(stepSummary, `\n${summary}`);
  return { summary };
}
