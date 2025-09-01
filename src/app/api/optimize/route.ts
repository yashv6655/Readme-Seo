import { NextRequest } from "next/server";

const SYSTEM_PROMPT_SIMPLE = `You are an expert README editor.
Rewrite READMEs to improve GitHub/Google/LLM discoverability and readability.
Output STRICTLY the improved Markdown only. No preface or explanations.`;

const SYSTEM_PROMPT_WITH_CONTEXT = `You are an expert README author.
Given repository context (metadata, key files, scripts) and possibly an empty current README, write a clear, accurate, SEO-friendly README.md.
Include: title, description, badges if relevant, quick start/install, usage examples, key features, configuration, roadmap or contributing if applicable, and license if detected.
Prefer facts from the context. If unknown, omit rather than invent. Output ONLY Markdown.`;

function simpleUserPrompt(content: string, goals?: string, repoUrl?: string, ref?: string) {
  const linkLine = repoUrl ? `\nRepository: ${repoUrl}${ref ? ` (branch ${ref})` : ""}` : "";
  return `Improve the README between <readme> tags for SEO while preserving accuracy.${linkLine}\nGoals: ${goals || "improve headings, keywords, install, usage, links, badges, license, metadata"}.\nReturn ONLY Markdown.\n<readme>\n${content}\n</readme>`;
}

type RepoMeta = {
  name: string;
  full_name: string;
  description?: string;
  homepage?: string;
  topics?: string[];
  default_branch: string;
  license?: { key: string; name: string } | null;
};

async function ghJson(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
      "User-Agent": "readme-review-tool",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} ${url}`);
  return res.json();
}

async function ghText(repo: string, path: string, ref: string | undefined, token: string): Promise<string | null> {
  try {
    const url = new URL(`https://api.github.com/repos/${repo}/contents/${path}`);
    if (ref) url.searchParams.set("ref", ref);
    const data = await ghJson(url.toString(), token);
    if (!data?.content || !data?.encoding) return null;
    if (data.size && data.size > 200_000) return null; // skip large files
    const text = Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf-8");
    return text;
  } catch {
    return null;
  }
}

function buildContextBlock(meta: RepoMeta, snippets: Record<string, string | null>) {
  let out = `Repo: ${meta.full_name}\n`;
  out += `URL: https://github.com/${meta.full_name}\n`;
  if (meta.description) out += `Description: ${meta.description}\n`;
  if (meta.homepage) out += `Homepage: ${meta.homepage}\n`;
  if (meta.topics && meta.topics.length) out += `Topics: ${meta.topics.join(", ")}\n`;
  if (meta.license) out += `License: ${meta.license.name}\n`;
  out += `Default branch: ${meta.default_branch}\n`;
  out += `\n---- Key files (trimmed) ----\n`;
  for (const [path, text] of Object.entries(snippets)) {
    if (!text) continue;
    const trimmed = text.length > 4000 ? text.slice(0, 4000) + "\n/* …trimmed… */" : text;
    out += `\n<file path="${path}">\n${trimmed}\n</file>\n`;
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    // Public endpoint: no auth required
    const body = await req.json().catch(() => ({}));
    const content: string | undefined = body?.content;
    const goals: string | undefined = body?.goals;
    const repo: string | undefined = body?.repo; // owner/name
    const ref: string | undefined = body?.ref || body?.branch;

    const key = process.env.CLAUDE_KEY;
    const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";
    if (!key) return Response.json({ error: "Server missing CLAUDE_KEY" }, { status: 500 });

    const shouldUseContext = (!content || content.trim().length < 50) && !!repo;

    let system = SYSTEM_PROMPT_SIMPLE;
    let user: string;

    if (shouldUseContext) {
      const ghToken = process.env.GITHUB_TOKEN;
      if (!ghToken) return Response.json({ error: "Server missing GITHUB_TOKEN" }, { status: 500 });

      // Fetch metadata
      const meta = (await ghJson(`https://api.github.com/repos/${repo}`, ghToken)) as RepoMeta;
      const branch = ref || meta.default_branch;

      // Collect useful files (best-effort)
      const candidates = [
        "package.json",
        "README.md",
        "LICENSE",
        "CONTRIBUTING.md",
        "CHANGELOG.md",
        "docs/README.md",
        "src/app/page.tsx",
        "src/app/layout.tsx",
        "src/index.ts",
        "src/index.tsx",
        "src/main.ts",
        "src/main.tsx",
        "app/page.tsx",
        "app/layout.tsx",
        "pyproject.toml",
        "setup.cfg",
        "Cargo.toml",
        "go.mod",
      ];

      const snippets: Record<string, string | null> = {};
      for (const p of candidates) {
        // Stop if we collected enough
        if (Object.values(snippets).join("\n").length > 80_000) break;
        // eslint-disable-next-line no-await-in-loop
        snippets[p] = await ghText(repo!, p, branch, ghToken);
      }

      const context = buildContextBlock(meta, snippets);
      system = SYSTEM_PROMPT_WITH_CONTEXT;
      user = `Using the following repository context, generate a high-quality README.md.\n${goals ? `Goals: ${goals}\n` : ""}Repository: https://github.com/${meta.full_name}${ref ? ` (branch ${branch})` : ""}\n<repo-context>\n${context}\n</repo-context>`;
    } else if (content && content.trim().length >= 50) {
      const repoUrl = repo ? `https://github.com/${repo}` : undefined;
      user = simpleUserPrompt(content, goals, repoUrl, ref);
    } else {
      return Response.json({ error: "Provide 'content' or 'repo' to optimize." }, { status: 400 });
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
        max_tokens: 3000,
        temperature: 0.2,
        system,
        messages: [
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ error: `Claude error ${res.status}`, details: text }, { status: res.status });
    }

    const data = await res.json();
    const text: string | undefined = data?.content?.[0]?.text;
    if (!text) return Response.json({ error: "Claude returned empty response" }, { status: 502 });

    return new Response(text, { headers: { "content-type": "text/markdown; charset=utf-8" } });
  } catch (err: any) {
    return Response.json({ error: "Unexpected error", details: String(err?.message || err) }, { status: 500 });
  }
}
