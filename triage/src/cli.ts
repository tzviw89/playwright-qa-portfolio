import { compileTriageGraph } from "./graph.ts";
import { DEFAULT_REPORT_PATH, DEFAULT_SUMMARY_PATH, initialState } from "./state.ts";

const reportPath = process.argv[2] ?? DEFAULT_REPORT_PATH;
const summaryPath = process.argv[3] ?? DEFAULT_SUMMARY_PATH;

try {
  const result = await compileTriageGraph().invoke(initialState(reportPath, summaryPath));
  process.stdout.write(result.summary);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`triage: ${message}\n`);
  process.exitCode = 1;
}
