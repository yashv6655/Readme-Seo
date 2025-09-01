import { NextRequest } from "next/server";

type GitHubReadmeResponse = {
  content: string; // base64
  sha: string;
  encoding: string;
  path: string;
};

export async function GET(req: NextRequest) {
  try {
    // Public endpoint: no auth required
    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo"); // format: owner/name
    const refParam = searchParams.get("ref") || searchParams.get("branch") || "";

    if (!repo || !/^[^\s\/]+\/[\w.-]+$/.test(repo)) {
      return Response.json({ error: "Invalid or missing repo (use owner/name)" }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return Response.json({ error: "Server missing GITHUB_TOKEN" }, { status: 500 });
    }

    const baseUrl = new URL(`https://api.github.com/repos/${repo}/readme`);
    if (refParam) baseUrl.searchParams.set("ref", refParam);
    const ghRes = await fetch(baseUrl.toString(), {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${token}`,
        "User-Agent": "readme-review-tool",
      },
      cache: "no-store",
    });

    if (!ghRes.ok) {
      const text = await ghRes.text();
      return Response.json({ error: `GitHub error ${ghRes.status}`, details: text }, { status: ghRes.status });
    }

    const data = (await ghRes.json()) as GitHubReadmeResponse;
    const content = Buffer.from(data.content || "", data.encoding as BufferEncoding).toString("utf-8");

    return Response.json({ content, sha: data.sha, path: data.path, ref: refParam || undefined });
  } catch (err: any) {
    return Response.json({ error: "Unexpected error", details: String(err?.message || err) }, { status: 500 });
  }
}
