import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/auth/api-auth";

type ScoreResult = {
  score: number;
  breakdown: Record<string, number>;
  summary: string[];
  top_fixes: string[];
};

const SYSTEM_PROMPT = `You are an expert README SEO critic.
Evaluate the provided README for GitHub/Google/LLM discoverability.
Return STRICT JSON only matching this TypeScript type without extra text:
{
  "score": number, // 0-100
  "breakdown": { [category: string]: number }, // each 0-10
  "summary": string[], // 3 short bullets
  "top_fixes": string[] // ordered list of most impactful actions
}`;

function buildUserPrompt(content: string) {
  return `README to score (between <readme> tags):\n<readme>\n${content}\n</readme>\n\nCategories to score (0-10 each): clarity, structure, headings, keywords, install, usage, examples, links, badges, images, contribution, license, metadata.\nReturn JSON only.`;
}

export async function POST(req: NextRequest) {
  try {
    // Public endpoint: no auth required, but track authenticated users
    await getApiUser();
    const body = await req.json().catch(() => ({}));
    const content: string | undefined = body?.content;
    if (!content || typeof content !== "string") {
      return Response.json({ error: "Missing 'content' (README markdown)" }, { status: 400 });
    }

    const key = process.env.CLAUDE_KEY;
    const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";
    if (!key) {
      return Response.json({ error: "Server missing CLAUDE_KEY" }, { status: 500 });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: buildUserPrompt(content) },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ error: `Claude error ${res.status}`, details: text }, { status: res.status });
    }

    const data = await res.json();
    const text: string | undefined = data?.content?.[0]?.text;
    if (!text) {
      return Response.json({ error: "Claude returned empty response" }, { status: 502 });
    }

    let parsed: ScoreResult | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json({ error: "Claude returned non-JSON", raw: text }, { status: 502 });
    }

    return Response.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}
