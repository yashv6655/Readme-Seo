"use client";

import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeoScore } from "@/components/ui/seo-score";
import { ProtectedRoute } from "@/components/auth/protected-route";

type ScoreResult = {
  score: number;
  breakdown: Record<string, number>;
  summary: string[];
  top_fixes: string[];
};

type Source = "editor" | "optimized";

function ReadmeReviewContent() {
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("");
  const [readme, setReadme] = useState("");
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState<"fetch" | "score" | "opt" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [optimized, setOptimized] = useState<string | null>(null);
  const [actionSource, setActionSource] = useState<Source>("editor");
  const [previewSource, setPreviewSource] = useState<Source>("editor");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const currentContent = actionSource === "optimized" && optimized ? optimized : readme;
  const previewContent = previewSource === "optimized" && optimized ? optimized : readme;

  const fetchReadme = useCallback(async () => {
    setLoading("fetch");
    setError(null);
    setScore(null);
    setOptimized(null);
    setLastAction("Fetched README");
    try {
      const url = new URL(`/api/readme`, window.location.origin);
      url.searchParams.set("repo", repo.trim());
      if (branch) url.searchParams.set("ref", branch.trim());
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch README");
      setReadme(data.content || "");
      setSha(data.sha || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(null);
    }
  }, [repo, branch]);

  const runScore = useCallback(async () => {
    setLoading("score");
    setError(null);
    setScore(null);
    setLastAction(`Scoring ${actionSource}`);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: currentContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to score");
      setScore(data as ScoreResult);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(null);
    }
  }, [currentContent, actionSource]);

  const runOptimize = useCallback(async () => {
    setLoading("opt");
    setError(null);
    setOptimized(null);
    const willUseRepo = (!readme || readme.trim().length < 50) && !!repo;
    setLastAction(willUseRepo ? "Generating from repo context" : "Optimizing editor content");
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content: readme,
          repo: repo || undefined,
          ref: branch || undefined,
        }),
      });
      const data = await res.text();
      if (!res.ok) throw new Error("Failed to optimize");
      setOptimized(data);
      setPreviewSource("optimized");
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(null);
    }
  }, [readme, repo, branch]);

  const applyOptimized = useCallback(() => {
    if (!optimized) return;
    const ok = window.confirm("Replace editor content with optimized version?");
    if (!ok) return;
    setReadme(optimized);
    setOptimized(null);
    setPreviewSource("editor");
    setActionSource("editor");
    setLastAction("Applied optimized to editor");
  }, [optimized]);

  const breakdownList = useMemo(() => {
    if (!score?.breakdown) return [] as Array<[string, number]>;
    return Object.entries(score.breakdown).sort((a, b) => a[0].localeCompare(b[0]));
  }, [score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold gradient-text">README Review</h1>
            {sha && (
              <span className="text-xs text-muted-foreground">sha {sha.slice(0,7)}</span>
            )}
            {lastAction && (
              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{lastAction}</span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-xs text-muted-foreground">Actions target</div>
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button variant={actionSource === 'editor' ? 'default' : 'ghost'} size="sm" onClick={() => setActionSource('editor')}>Editor</Button>
              <Button variant={actionSource === 'optimized' ? 'default' : 'ghost'} size="sm" onClick={() => setActionSource('optimized')} disabled={!optimized}>Optimized</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Fetch Card */}
        <Card glass>
          <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <CardTitle>Fetch README</CardTitle>
              <CardDescription>Pull from GitHub using owner/name and optional branch</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="gradient" onClick={fetchReadme} loading={loading === 'fetch'} disabled={!repo}>Fetch README</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Repository" placeholder="owner/name" value={repo} onChange={(e) => setRepo(e.target.value)} />
              <Input label="Branch (optional)" placeholder="default branch if empty" value={branch} onChange={(e) => setBranch(e.target.value)} />
              <div className="hidden lg:block" />
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {/* Editor & Preview */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Card className="md:col-span-1 min-w-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Editor</CardTitle>
              <div className="text-xs text-muted-foreground">Paste or edit here. If empty, Optimize will analyze the repo to generate a draft.</div>
            </CardHeader>
            <CardContent>
              <textarea
                className="border rounded-lg w-full h-[520px] p-3 font-mono text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                value={readme}
                onChange={(e) => setReadme(e.target.value)}
                placeholder="# Paste or fetch a README.md here"
              />
            </CardContent>
            <CardFooter className="flex items-center gap-2">
              <Button variant="gradient" onClick={runScore} loading={loading === 'score'} disabled={!currentContent}>
                Score {actionSource === 'optimized' ? '(Optimized)' : '(Editor)'}
              </Button>
              <Button variant="outline" onClick={runOptimize} loading={loading === 'opt'} disabled={!readme}>
                Optimize (from Editor)
              </Button>
              <Button variant="ghost" onClick={applyOptimized} disabled={!optimized}>Apply Optimized → Editor</Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-1 min-w-0">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                <Button variant={previewSource === 'editor' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewSource('editor')}>Editor</Button>
                <Button variant={previewSource === 'optimized' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewSource('optimized')} disabled={!optimized}>Optimized</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 prose max-w-none dark:prose-invert overflow-auto h-[520px] readme-preview relative break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {previewContent}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {score && (
          <Card glass>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>SEO Score</CardTitle>
                <CardDescription>Based on {actionSource} content</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <SeoScore score={Math.round(score.score)} size="md" />
                <div className="text-sm text-muted-foreground number-centered">
                  <div className="text-2xl font-semibold">{Math.round(score.score)} / 100</div>
                  <div>Overall</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-2">Category Breakdown</div>
                  <div className="grid grid-cols-2 gap-2">
                    {breakdownList.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                        <span className="capitalize text-muted-foreground">{k}</span>
                        <span className="font-medium">{v}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Summary</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {score.summary?.map((s, i) => (<li key={i}>{s}</li>))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Top Fixes</div>
                    <ol className="list-decimal pl-5 text-sm space-y-1">
                      {score.top_fixes?.map((s, i) => (<li key={i}>{s}</li>))}
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function PageClient() {
  return (
    <ProtectedRoute>
      <ReadmeReviewContent />
    </ProtectedRoute>
  );
}
