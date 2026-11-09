import { END, START, StateGraph } from "@langchain/langgraph";

import type { ClassifierModel } from "./llm.ts";
import { extractFailures } from "./nodes/extractFailures.ts";
import { llmClassify } from "./nodes/llmClassify.ts";
import { loadReport } from "./nodes/loadReport.ts";
import { ruleClassify } from "./nodes/ruleClassify.ts";
import { writeSummary } from "./nodes/writeSummary.ts";
import { TriageAnnotation, type TriageState } from "./state.ts";

/** Skip the model when no key is set, or when every failure already has a rule. */
export function routeAfterRules(state: TriageState): "llmClassify" | "writeSummary" {
  const unresolved = state.classifications.some((item) => item.label === "unresolved");
  const hasKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  return hasKey && unresolved ? "llmClassify" : "writeSummary";
}

export function compileTriageGraph(options?: { model?: ClassifierModel }) {
  return new StateGraph(TriageAnnotation)
    .addNode("loadReport", loadReport)
    .addNode("extractFailures", extractFailures)
    .addNode("ruleClassify", ruleClassify)
    .addNode("llmClassify", (state) => llmClassify(state, options?.model))
    .addNode("writeSummary", writeSummary)
    .addEdge(START, "loadReport")
    .addEdge("loadReport", "extractFailures")
    .addEdge("extractFailures", "ruleClassify")
    .addConditionalEdges("ruleClassify", routeAfterRules, ["llmClassify", "writeSummary"])
    .addEdge("llmClassify", "writeSummary")
    .addEdge("writeSummary", END)
    .compile();
}
