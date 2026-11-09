import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, test } from "node:test";

import { FakeListChatModel } from "@langchain/core/utils/testing";

import { compileTriageGraph } from "../src/graph.ts";
import {
  classificationResponseSchema,
  createChatModel,
  type ClassifierModel,
} from "../src/llm.ts";
import { failuresFromReport } from "../src/nodes/extractFailures.ts";
import { RULE_CONFIDENCE, classifyByRules } from "../src/rules.ts";
import { initialState, type Failure, type Label } from "../src/state.ts";

const fixturePath = path.join(import.meta.dirname, "../fixtures/sample-results.json");

function failure(overrides: Partial<Failure>): Failure {
  return {
    title: "example",
    project: "saucedemo",
    errorMessage: "Error: something broke",
    retryCount: 0,
    passedOnRetry: false,
    ...overrides,
  };
}

const ruleCases: Array<{
  name: string;
  failure: Partial<Failure>;
  label: Label | "unresolved";
  reason?: RegExp;
  confidence?: number;
}> = [
  {
    name: "a pass on retry is flaky even when the attempt timed out on a locator",
    failure: {
      passedOnRetry: true,
      retryCount: 1,
      errorMessage:
        "TimeoutError: locator.click: Timeout 10000ms exceeded.\nwaiting for getByRole('button', { name: 'Checkout' })",
    },
    label: "flaky",
    confidence: RULE_CONFIDENCE.flaky,
  },
  {
    name: "a strict-mode violation is a test bug",
    failure: { errorMessage: "Error: strict mode violation: locator('button') resolved to 2 elements" },
    label: "test bug",
    confidence: RULE_CONFIDENCE.testBug,
    reason: /Strict-mode/,
  },
  {
    name: "a locator timeout is a test bug",
    failure: { errorMessage: "TimeoutError: locator.click: Timeout 10000ms exceeded." },
    label: "test bug",
    reason: /Locator timed out/,
  },
  {
    name: "a test-level timeout stays unresolved",
    failure: { errorMessage: "Error: Test timeout of 30000ms exceeded." },
    label: "unresolved",
  },
  {
    name: "an HTTP 500 from response.status() is a product bug",
    failure: {
      errorMessage: "Expected: 201\nReceived: 500\n\nexpect(response.status()).toBe(201);",
    },
    label: "product bug",
    reason: /HTTP 5xx/,
    confidence: RULE_CONFIDENCE.productBug,
  },
  {
    name: "a wrong response body is a product bug",
    failure: {
      errorMessage:
        "Expected: \"Created\"\nReceived: \"Unavailable\"\n\nexpect(await response.text()).toBe('Created');",
    },
    label: "product bug",
    reason: /value the test did not expect/,
  },
  {
    name: "a line number that looks like 500 stays unresolved",
    failure: { errorMessage: "Error: expect(received).toBe(expected)\n   at inventory.spec.ts:500:12" },
    label: "unresolved",
  },
  {
    name: "apiRequestContext 502 is a product bug",
    failure: { errorMessage: "Error: apiRequestContext.get: 502 Bad Gateway" },
    label: "product bug",
    reason: /HTTP 5xx/,
  },
  {
    name: "a message with no rule stays unresolved",
    failure: { errorMessage: "Error: navigation failed before the page settled" },
    label: "unresolved",
    confidence: 0,
    reason: /No rule matched/,
  },
];

function fakeClassifier(payload: unknown): ClassifierModel {
  const fake = new FakeListChatModel({ responses: [JSON.stringify(payload)] });
  return {
    withStructuredOutput(schema) {
      const runnable = fake.withStructuredOutput(schema);
      return { invoke: (input: string) => runnable.invoke(input) };
    },
  };
}

const throwingModel: ClassifierModel = {
  withStructuredOutput() {
    throw new Error("model should not be called");
  },
};

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "triage-"));
}

function restore(name: "OPENAI_API_KEY" | "GITHUB_STEP_SUMMARY", value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

async function runGraph(
  reportPath: string,
  options?: { model?: ClassifierModel; key?: string; step?: boolean },
) {
  const dir = await tempDir();
  const summaryPath = path.join(dir, "triage-summary.md");
  const stepPath = path.join(dir, "step.md");
  const previousKey = process.env.OPENAI_API_KEY;
  const previousStep = process.env.GITHUB_STEP_SUMMARY;
  if (options?.key === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = options.key;
  if (options?.step === false) delete process.env.GITHUB_STEP_SUMMARY;
  else process.env.GITHUB_STEP_SUMMARY = stepPath;
  try {
    const result = await compileTriageGraph({ model: options?.model }).invoke(
      initialState(reportPath, summaryPath),
    );
    const summary = await readFile(summaryPath, "utf8");
    const step = options?.step === false ? "" : await readFile(stepPath, "utf8");
    return { result, summary, step };
  } finally {
    restore("OPENAI_API_KEY", previousKey);
    restore("GITHUB_STEP_SUMMARY", previousStep);
  }
}

async function writeReport(body: unknown): Promise<string> {
  const dir = await tempDir();
  const reportPath = path.join(dir, "results.json");
  await writeFile(reportPath, JSON.stringify(body));
  return reportPath;
}

function unexpected(title: string, message: string, project = "saucedemo") {
  return {
    title,
    tests: [
      {
        projectName: project,
        status: "unexpected",
        results: [{ status: "failed", retry: 0, errors: [{ message }] }],
      },
    ],
  };
}

describe("triage", { concurrency: false }, () => {
  for (const item of ruleCases) {
    test(item.name, () => {
      const result = classifyByRules(failure(item.failure));
      assert.equal(result.label, item.label);
      if (item.confidence !== undefined) assert.equal(result.confidence, item.confidence);
      if (item.reason) assert.match(result.reason, item.reason);
      assert.equal(result.reason.includes("\n"), false);
    });
  }

  test("extractFailures keeps failures and passes on retry, and drops passes and skips", async () => {
    const report = JSON.parse(await readFile(fixturePath, "utf8")) as unknown;
    const failures = failuresFromReport(report);
    assert.deepEqual(
      failures.map((item) => [item.title, item.project, item.retryCount, item.passedOnRetry]),
      [
        ["taxed total is the subtotal plus 8 percent", "saucedemo", 1, true],
        ["sort the catalog by price", "saucedemo", 0, false],
        ["cart › add one item", "saucedemo", 0, false],
        ["create booking returns the new id", "restful-booker", 1, false],
        ["read booking returns the saved name", "restful-booker", 0, false],
      ],
    );
    assert.match(failures[0].errorMessage, /Timeout 10000ms exceeded/);
    assert.match(failures[3].errorMessage, /Received: 500/);
    assert.equal(failures.some((item) => item.title.includes("thank-you")), false);
    assert.equal(failures.some((item) => item.title.includes("delete booking")), false);
  });

  test("rules-only graph writes a summary and skips the model", async () => {
    const { result, summary, step } = await runGraph(fixturePath);
    const byTitle = new Map(result.failures.map((item, index) => [item.title, result.classifications[index]]));
    assert.equal(result.llmUsed, false);
    assert.equal(byTitle.get("taxed total is the subtotal plus 8 percent")?.label, "flaky");
    assert.equal(byTitle.get("cart › add one item")?.label, "test bug");
    assert.equal(byTitle.get("create booking returns the new id")?.label, "product bug");
    assert.equal(byTitle.get("read booking returns the saved name")?.label, "product bug");
    assert.equal(byTitle.get("sort the catalog by price")?.label, "unresolved");
    assert.match(summary, /Labels are suggestions/);
    assert.match(summary, /Model called: no/);
    assert.match(summary, /Failures: 5/);
    assert.match(step, /sort the catalog by price/);
    assert.equal(summary.trim(), step.trim());
  });

  test("the model classifies only unresolved failures", async () => {
    const reportPath = await writeReport({
      suites: [
        {
          title: "tests/app.spec.ts",
          file: "tests/app.spec.ts",
          specs: [
            unexpected("add one item", "Error: strict mode violation: locator('button') resolved to 2 elements"),
            unexpected("sort the catalog by price", "Error: navigation failed before the page settled"),
            unexpected("open the menu", "Error: the harness stopped"),
          ],
        },
      ],
    });
    const model = fakeClassifier({
      items: [
        { index: 1, label: "product bug", confidence: 0.4, reason: "The page never finished navigating." },
        { index: 0, label: "flaky", confidence: 0.2, reason: "Ignore this. Rules already classified it." },
      ],
    });
    const { result, summary } = await runGraph(reportPath, { model, key: "sk-test-not-real" });
    assert.equal(result.llmUsed, true);
    assert.equal(result.classifications[0].label, "test bug");
    assert.equal(result.classifications[1].label, "product bug");
    assert.equal(result.classifications[1].confidence, 0.4);
    assert.equal(result.classifications[1].reason, "The page never finished navigating.");
    assert.equal(result.classifications[2].label, "unresolved");
    assert.match(summary, /Model called: yes/);
    classificationResponseSchema.parse({
      items: [{ index: 1, label: "product bug", confidence: 0.4, reason: "ok" }],
    });
  });

  test("the model is skipped when every failure already has a rule", async () => {
    const reportPath = await writeReport({
      suites: [
        {
          title: "tests/app.spec.ts",
          file: "tests/app.spec.ts",
          specs: [
            {
              title: "checkout button",
              tests: [
                {
                  projectName: "saucedemo",
                  status: "flaky",
                  results: [
                    { status: "failed", retry: 0, errors: [{ message: "TimeoutError: locator.click: Timeout 10000ms exceeded." }] },
                    { status: "passed", retry: 1, errors: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    const { result } = await runGraph(reportPath, {
      model: throwingModel,
      key: "sk-test-not-real",
    });
    assert.equal(result.llmUsed, false);
    assert.equal(result.classifications[0].label, "flaky");
  });

  test("an empty report writes a summary without a job summary file", async () => {
    const reportPath = await writeReport({ suites: [] });
    const { result, summary } = await runGraph(reportPath, { step: false });
    assert.equal(result.failures.length, 0);
    assert.equal(result.llmUsed, false);
    assert.match(summary, /No failed tests, and no tests passed on retry/);
    assert.match(summary, /Labels are suggestions/);
  });

  test("missing and invalid reports fail with a clear error", async () => {
    await assert.rejects(
      () => runGraph(path.join(tmpdir(), "missing-playwright-results.json")),
      /not found/,
    );
    const badJson = await writeReport("not-used");
    await writeFile(badJson, "{");
    await assert.rejects(() => runGraph(badJson), /not valid JSON/);
    const noSuites = await writeReport({ config: {} });
    await assert.rejects(() => runGraph(noSuites), /no suites array/);
  });

  test("createChatModel requires OPENAI_API_KEY and does not call the network", () => {
    const previous = process.env.OPENAI_API_KEY;
    try {
      delete process.env.OPENAI_API_KEY;
      assert.throws(() => createChatModel(), /OPENAI_API_KEY is not set/);
      process.env.OPENAI_API_KEY = "   ";
      assert.throws(() => createChatModel(), /OPENAI_API_KEY is not set/);
      process.env.OPENAI_API_KEY = "sk-test-not-real";
      const model = createChatModel();
      assert.equal(typeof model.withStructuredOutput, "function");
    } finally {
      restore("OPENAI_API_KEY", previous);
    }
  });
});
