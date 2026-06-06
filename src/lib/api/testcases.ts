export interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expected: string;
  priority: "High" | "Medium" | "Low";
}

export interface TestDataItem {
  field: string;
  valid: string[];
  invalid: string[];
  boundary: string[];
}

export interface TestPlan {
  summary: string;
  acceptanceCriteria: string[];
  positive: TestCase[];
  negative: TestCase[];
  edge: TestCase[];
  testData: TestDataItem[];
  playwright: string;
}

export type TestFocus = "functional" | "api" | "ui" | "integration";

export interface GenerateTestCasesInput {
  requirement: string;
  testType: TestFocus;
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function generateTestCases({
  requirement,
  testType,
}: GenerateTestCasesInput): Promise<TestPlan> {
  const trimmedRequirement = requirement.trim();
  if (trimmedRequirement.length < 10) {
    throw new Error("Please describe the requirement in at least 10 characters.");
  }

  await wait(650);

  const focusLabel = testType[0].toUpperCase() + testType.slice(1);
  const shortRequirement = trimmedRequirement.split(/\s+/).slice(0, 18).join(" ");

  return {
    summary: `${focusLabel} test coverage for: ${shortRequirement}${
      trimmedRequirement.length > shortRequirement.length ? "..." : ""
    }`,
    acceptanceCriteria: [
      "Given the user has access to the feature, when they complete the happy path, then the expected outcome is shown.",
      "Given required data is missing or invalid, when the user submits the flow, then clear validation feedback is displayed.",
      "Given an edge condition occurs, when the user continues the workflow, then the application handles it without data loss.",
      "Given the operation succeeds, when the user revisits the feature, then the new state is persisted and visible.",
    ],
    positive: [
      {
        id: "TC-P-01",
        title: "Complete the primary successful workflow",
        steps: [
          "Open the feature entry point.",
          "Enter all required valid details.",
          "Submit the form or complete the primary action.",
        ],
        expected: "The action completes successfully and the confirmation state is displayed.",
        priority: "High",
      },
      {
        id: "TC-P-02",
        title: "Verify saved state after success",
        steps: [
          "Complete the successful workflow.",
          "Refresh or revisit the page.",
          "Review the displayed feature state.",
        ],
        expected: "The latest successful state remains available to the user.",
        priority: "Medium",
      },
      {
        id: "TC-P-03",
        title: "Use optional fields with valid values",
        steps: [
          "Open the feature entry point.",
          "Fill required and optional fields with valid values.",
          "Submit the workflow.",
        ],
        expected: "Optional values are accepted and included in the completed result.",
        priority: "Medium",
      },
      {
        id: "TC-P-04",
        title: "Navigate back after completion",
        steps: [
          "Complete the primary workflow.",
          "Use navigation to return to the previous screen.",
          "Open the feature again.",
        ],
        expected: "Navigation remains stable and the user can continue without errors.",
        priority: "Low",
      },
    ],
    negative: [
      {
        id: "TC-N-01",
        title: "Submit with required information missing",
        steps: [
          "Open the feature.",
          "Leave one or more required fields empty.",
          "Submit the form.",
        ],
        expected: "The form is blocked and field-level validation messages are shown.",
        priority: "High",
      },
      {
        id: "TC-N-02",
        title: "Submit invalid data format",
        steps: ["Open the feature.", "Enter incorrectly formatted values.", "Submit the form."],
        expected: "Invalid values are rejected with clear correction guidance.",
        priority: "High",
      },
      {
        id: "TC-N-03",
        title: "Handle duplicate or repeated submission",
        steps: [
          "Enter valid details.",
          "Submit the workflow.",
          "Trigger the submit action again before or after completion.",
        ],
        expected:
          "Duplicate processing is prevented or handled without creating inconsistent state.",
        priority: "Medium",
      },
      {
        id: "TC-N-04",
        title: "Handle network or service failure",
        steps: ["Open the feature.", "Enter valid details.", "Simulate a failed request."],
        expected: "The user sees a recoverable error message and can retry safely.",
        priority: "High",
      },
    ],
    edge: [
      {
        id: "TC-E-01",
        title: "Use boundary length values",
        steps: [
          "Enter values at minimum allowed length.",
          "Enter values at maximum allowed length.",
          "Submit both scenarios.",
        ],
        expected: "Boundary values are accepted or rejected according to the requirement.",
        priority: "Medium",
      },
      {
        id: "TC-E-02",
        title: "Use special characters and whitespace",
        steps: [
          "Enter values with leading/trailing whitespace.",
          "Enter symbols and mixed case values.",
          "Submit the workflow.",
        ],
        expected: "Input is sanitized, preserved, or rejected consistently with validation rules.",
        priority: "Medium",
      },
      {
        id: "TC-E-03",
        title: "Resume after page reload",
        steps: [
          "Start entering details.",
          "Reload the page or navigate away and back.",
          "Continue the workflow.",
        ],
        expected: "The application handles the interrupted session predictably.",
        priority: "Low",
      },
    ],
    testData: [
      {
        field: "Required text",
        valid: ["Valid user input", "Mixed Case Value"],
        invalid: ["", "   "],
        boundary: ["Min length", "Max allowed length"],
      },
      {
        field: "Identifier",
        valid: ["user@example.com", "ABC-12345"],
        invalid: ["invalid-format", "duplicate value"],
        boundary: ["First record", "Last record"],
      },
      {
        field: "Request state",
        valid: ["Success", "Pending"],
        invalid: ["Unauthorized", "Expired"],
        boundary: ["Retry limit reached", "Timeout threshold"],
      },
    ],
    playwright: `import { test, expect } from "@playwright/test";

test.describe("${focusLabel} requirement flow", () => {
  test("completes the primary successful workflow", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/requirement|user story/i).fill(${JSON.stringify(shortRequirement)});
    await page.getByRole("button", { name: /generate/i }).click();
    await expect(page.getByText(/Generated Test Plan/i)).toBeVisible();
  });

  test("shows validation for missing requirement", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /generate/i }).click();
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });
});`,
  };
}
