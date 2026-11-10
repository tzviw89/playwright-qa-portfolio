import { classifyByRules } from "../rules.ts";
import type { TriageState } from "../state.ts";

export function ruleClassify(state: TriageState): Partial<TriageState> {
  return { classifications: state.failures.map(classifyByRules) };
}
