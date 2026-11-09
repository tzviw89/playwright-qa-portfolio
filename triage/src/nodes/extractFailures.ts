import type { Failure, TriageState } from "../state.ts";

type ReportError = { message?: string };
type ReportResult = { status?: string; retry?: number; error?: ReportError; errors?: ReportError[] };
type ReportTest = { projectName?: string; status?: string; results?: ReportResult[] };
type ReportSpec = { title?: string; tests?: ReportTest[] };
type ReportSuite = { title?: string; file?: string; specs?: ReportSpec[]; suites?: ReportSuite[] };

const MESSAGE_LIMIT = 1500;

function isFileSuite(suite: ReportSuite): boolean {
  const title = suite.title ?? "";
  if (suite.file && title === suite.file) return true;
  return /(?:^|\/)[^/]+\.(?:spec|test)\.[cm]?[jt]sx?$/.test(title);
}

function errorMessage(result: ReportResult | undefined): string {
  if (!result) return "";
  const parts = (result.errors ?? []).map((error) => error.message ?? "").filter(Boolean);
  const raw = parts.length > 0 ? parts.join("\n") : (result.error?.message ?? "");
  const stripped = raw.replace(/\u001b\[[0-9;]*m/g, "").trim();
  if (!stripped) return "";
  return stripped.length > MESSAGE_LIMIT ? `${stripped.slice(0, MESSAGE_LIMIT)}…` : stripped;
}

function toFailure(spec: ReportSpec, test: ReportTest, titles: string[]): Failure | null {
  const results = test.results ?? [];
  const outcome = test.status;
  const failing = results.filter((result) => result.status === "failed" || result.status === "timedOut");
  const passedLater = results.some((result) => result.status === "passed" && (result.retry ?? 0) > 0);
  const passedOnRetry = passedLater || outcome === "flaky";
  const include =
    outcome === "unexpected" ||
    outcome === "flaky" ||
    (outcome == null && (failing.length > 0 || passedLater));
  if (!include) return null;

  const retryCount = results.reduce((max, result) => Math.max(max, result.retry ?? 0), 0);
  const message = errorMessage(failing.at(-1));
  const title = [...titles, spec.title ?? ""].filter(Boolean).join(" › ");
  return {
    title: title || "(untitled)",
    project: test.projectName ?? "",
    errorMessage: message || "(no error message)",
    retryCount,
    passedOnRetry,
  };
}

function walk(suite: ReportSuite, titles: string[], out: Failure[]): void {
  const title = suite.title?.trim() ?? "";
  const next = !title || isFileSuite(suite) ? titles : [...titles, title];
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const failure = toFailure(spec, test, next);
      if (failure) out.push(failure);
    }
  }
  for (const child of suite.suites ?? []) walk(child, next, out);
}

export function failuresFromReport(report: unknown): Failure[] {
  const suites = (report as { suites?: unknown } | null)?.suites;
  if (!Array.isArray(suites)) {
    throw new Error("Playwright JSON report has no suites array");
  }
  const failures: Failure[] = [];
  for (const suite of suites) {
    if (suite && typeof suite === "object") walk(suite as ReportSuite, [], failures);
  }
  return failures;
}

export function extractFailures(state: TriageState): Partial<TriageState> {
  return { failures: failuresFromReport(state.report) };
}
