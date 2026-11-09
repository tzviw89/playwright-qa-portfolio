import { Annotation } from "@langchain/langgraph";

export const DEFAULT_REPORT_PATH = "test-results/results.json";
export const DEFAULT_SUMMARY_PATH = "triage-summary.md";

export type Failure = {
  title: string;
  project: string;
  errorMessage: string;
  retryCount: number;
  passedOnRetry: boolean;
};

export const LABELS = ["flaky", "product bug", "test bug"] as const;
export type Label = (typeof LABELS)[number];

/** `unresolved` means no rule matched and a model did not classify the failure. */
export type Classification = {
  label: Label | "unresolved";
  confidence: number;
  reason: string;
};

/** `report` is the parsed JSON. `summaryPath` is where writeSummary writes. */
export const TriageAnnotation = Annotation.Root({
  reportPath: Annotation<string>,
  report: Annotation<unknown>,
  failures: Annotation<Failure[]>,
  classifications: Annotation<Classification[]>,
  summary: Annotation<string>,
  summaryPath: Annotation<string>,
  llmUsed: Annotation<boolean>,
});

export type TriageState = typeof TriageAnnotation.State;

export function initialState(
  reportPath: string,
  summaryPath = DEFAULT_SUMMARY_PATH,
): TriageState {
  return {
    reportPath,
    report: null,
    failures: [],
    classifications: [],
    summary: "",
    summaryPath,
    llmUsed: false,
  };
}
