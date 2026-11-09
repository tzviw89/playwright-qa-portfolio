import { readFile } from "node:fs/promises";

import type { TriageState } from "../state.ts";

export async function loadReport(state: TriageState): Promise<Partial<TriageState>> {
  const reportPath = state.reportPath;
  let text: string;
  try {
    text = await readFile(reportPath, "utf8");
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") {
      throw new Error(`Playwright JSON report not found at ${reportPath}`);
    }
    throw error;
  }

  let report: unknown;
  try {
    report = JSON.parse(text);
  } catch {
    throw new Error(`Playwright JSON report at ${reportPath} is not valid JSON`);
  }

  if (!report || typeof report !== "object" || !Array.isArray((report as { suites?: unknown }).suites)) {
    throw new Error(`Playwright JSON report at ${reportPath} has no suites array`);
  }
  return { report };
}
