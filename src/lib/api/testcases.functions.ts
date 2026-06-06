import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  requirement: z.string().min(10).max(8000),
  testType: z.enum(["functional", "api", "ui", "integration"]).default("functional"),
});

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

const SYSTEM_PROMPT = `You are a senior QA architect. Given a user story, requirement, or acceptance criteria, generate a comprehensive, professional test plan.

Return STRICT JSON only (no markdown fences, no commentary) matching this schema:
{
  "summary": string,                     // 1-2 sentence summary of what is being tested
  "acceptanceCriteria": string[],        // 3-6 crisp Given/When/Then style criteria
  "positive": [{ "id": "TC-P-01", "title": string, "steps": string[], "expected": string, "priority": "High"|"Medium"|"Low" }],
  "negative": [{ "id": "TC-N-01", "title": string, "steps": string[], "expected": string, "priority": "High"|"Medium"|"Low" }],
  "edge":     [{ "id": "TC-E-01", "title": string, "steps": string[], "expected": string, "priority": "High"|"Medium"|"Low" }],
  "testData": [{ "field": string, "valid": string[], "invalid": string[], "boundary": string[] }],
  "playwright": string                   // a runnable Playwright TypeScript test file skeleton with describe/test blocks, real selectors stubbed, covering main positive + 1-2 negative flows
}

Rules:
- 4-6 positive, 4-6 negative, 3-5 edge cases.
- Steps should be numbered actions a tester can execute.
- Playwright code must be valid TypeScript using @playwright/test, include imports, expect assertions, and meaningful test names.
- Never include backticks or markdown. Output raw JSON only.`;

export const generateTestCases = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

    const userPrompt = `Test focus: ${data.testType}\n\nRequirement / User Story:\n${data.requirement}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 401)
        throw new Error("Groq API authentication failed. Check your GROQ_API_KEY.");
      const t = await res.text();
      console.error("Groq API error:", res.status, t);
      throw new Error("AI generation failed. Please try again.");
    }

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // try to recover JSON inside the string
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned malformed output. Please retry.");
      parsed = JSON.parse(match[0]);
    }
    return parsed as TestPlan;
  });
