import type { Classification, Failure } from "./state.ts";

const LOCATOR_TIMEOUT = /timeout \d+ms exceeded/i;
const LOCATOR_API = /locator\.|locator\(|getBy(?:Role|Text|Label|Placeholder|TestId|AltText|Title)/i;
const STRICT_MODE = /strict mode violation/i;
const HTTP_5XX =
  /(?:^|\n)\s*Received:\s*5\d\d\b|\b(?:https?(?:\/\d(?:\.\d)?)?\s+|status(?:\s*code)?[:\s]+)5\d\d\b|\bapiRequestContext\.\w+:\s*5\d\d\b|\b5\d\d\b\s+(?:Internal Server Error|Bad Gateway|Service Unavailable|Gateway Timeout)\b/i;
const WRONG_VALUE = /Expected:[\s\S]{0,240}?\n\s*Received:/;
const RESPONSE_ACCESS = /response\.(?:status|text|json|body)\(/;

/** Fixed scores for a rule hit. They are not a measured accuracy. */
export const RULE_CONFIDENCE = { flaky: 0.95, testBug: 0.85, productBug: 0.8 } as const;

function hit(label: Classification["label"], confidence: number, reason: string): Classification {
  return { label, confidence, reason };
}

/** First match wins. A later pass is flaky even when that attempt looks like a timeout. */
export function classifyByRules(failure: Failure): Classification {
  const message = failure.errorMessage;
  if (failure.passedOnRetry) return hit("flaky", RULE_CONFIDENCE.flaky, "Passed on a later retry.");
  if (STRICT_MODE.test(message)) {
    return hit(
      "test bug",
      RULE_CONFIDENCE.testBug,
      "Strict-mode violation: the locator matched more than one element.",
    );
  }
  if (LOCATOR_TIMEOUT.test(message) && LOCATOR_API.test(message)) {
    return hit("test bug", RULE_CONFIDENCE.testBug, "Locator timed out.");
  }
  if (HTTP_5XX.test(message)) {
    return hit("product bug", RULE_CONFIDENCE.productBug, "The app returned an HTTP 5xx status.");
  }
  if (WRONG_VALUE.test(message) && RESPONSE_ACCESS.test(message)) {
    return hit("product bug", RULE_CONFIDENCE.productBug, "The app returned a value the test did not expect.");
  }
  return hit("unresolved", 0, "No rule matched.");
}
