# Failure triage

After a Playwright run, this LangGraph.js agent reads the JSON report, lists failed tests and tests that passed on retry, and writes `triage-summary.md`.

**Labels are suggestions.** A rule hit gets a fixed confidence for that rule (flaky 0.95, test bug 0.85, product bug 0.8). A model hit keeps the confidence the model returned. Neither number is a measured accuracy.

## Rules, then the model

`ruleClassify` runs first:

| What the report shows | Label |
| --- | --- |
| Passed on a later retry | flaky |
| Locator timeout, or a strict-mode violation | test bug |
| HTTP 5xx, or an expected/received mismatch from `response.status()`, `response.text()`, `response.json()`, or `response.body()` | product bug |

Anything else stays `unresolved`. `llmClassify` runs only when something is still unresolved **and** `OPENAI_API_KEY` is set. With no key, the summary is rules-only. The key is read from that environment variable and is not written into the summary.

The model is OpenAI through `@langchain/openai`, constructed only in `src/llm.ts` (`createChatModel`). Swap the provider by changing that function. Callers depend on `withStructuredOutput`, not on the OpenAI client. The default model name is `gpt-4o-mini`.

## Graph

State is a LangGraph `Annotation`: `reportPath`, `report` (the parsed JSON), `failures` (title, project, error message, retry count, passed on retry), `classifications` (label, confidence, one-line reason), `summary`, `summaryPath`, `llmUsed`.

`loadReport` reads Playwright's built-in JSON reporter (default `test-results/results.json`) → `extractFailures` → `ruleClassify` → `llmClassify` when the conditional edge says so → `writeSummary`.

`writeSummary` overwrites the summary file (default `triage-summary.md`) and, when `GITHUB_STEP_SUMMARY` is set, appends the same markdown there.

## Run

From the repo root, after a Playwright run:

```bash
npm run triage
npm run triage -- test-results/results.json triage-summary.md
```

Try the checked-in sample with no key and no network:

```bash
npm run triage -- triage/fixtures/sample-results.json
```

Copy `.env.example` to `.env` if you want a model. `.env` is gitignored. Do not commit a key.

Unit tests use LangChain's `FakeListChatModel`, so they do not call the network and do not need a key:

```bash
npm run test:triage
```

Imports inside `triage/` use `.ts` extensions so Node can run the files directly. The package `"type": "module"` is what makes those files ESM.
