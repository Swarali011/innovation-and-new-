import React, { useState } from 'react';
import { GitBranch, ExternalLink, Search, Star, GitFork, Copy, Check, Eye, Code, ShieldCheck } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GitHubRepository } from '../types';
import { GitHubRepoDrawer } from '../components/github/GitHubRepoDrawer';

export const GitHubExplorerPage: React.FC = () => {
  const { activeProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [customRepos, setCustomRepos] = useState<GitHubRepository[] | null>(null);

  const defaultRepos: GitHubRepository[] = [
    {
      id: "gh-1",
      name: "langgraph-multiagent-copilot",
      full_name: "langchain-ai/langgraph",
      description: "Build resilient language agent graphs across multiple LLM providers with state persistence and human-in-the-loop validation.",
      owner: "langchain-ai",
      owner_avatar: "https://avatars.githubusercontent.com/u/126733545?v=4",
      stars: 14200,
      forks: 1850,
      open_issues: 42,
      primary_language: "Python",
      topics: ["multi-agent", "langgraph", "llm", "ai-research", "python"],
      last_updated: "2026-07-28",
      license: "MIT",
      html_url: "https://github.com/langchain-ai/langgraph",
      relevance_score: 0.98
    },
    {
      id: "gh-2",
      name: "fastapi-rag-knowledge-base",
      full_name: "tiangolo/fastapi",
      description: "High-performance FastAPI boilerplate with asynchronous database sessions, FAISS vector index, and SSE streaming pipeline.",
      owner: "tiangolo",
      owner_avatar: "https://avatars.githubusercontent.com/u/1326112?v=4",
      stars: 75800,
      forks: 6400,
      open_issues: 120,
      primary_language: "Python",
      topics: ["fastapi", "asyncio", "python", "api-gateway", "rest-api"],
      last_updated: "2026-07-29",
      license: "MIT",
      html_url: "https://github.com/tiangolo/fastapi",
      relevance_score: 0.94
    },
    {
      id: "gh-3",
      name: "react-tailwind-dashboard-ui",
      full_name: "tailwindlabs/tailwindcss",
      description: "Modern glassmorphism React dashboard with responsive sidebar, tabs, dark mode, and interactive Mermaid.js diagram viewer.",
      owner: "tailwindlabs",
      owner_avatar: "https://avatars.githubusercontent.com/u/67018801?v=4",
      stars: 81000,
      forks: 4200,
      open_issues: 85,
      primary_language: "TypeScript",
      topics: ["react", "typescript", "tailwindcss", "dashboard", "ui-kit"],
      last_updated: "2026-07-30",
      license: "MIT",
      html_url: "https://github.com/tailwindlabs/tailwindcss",
      relevance_score: 0.91
    }
  ];

  const reposToDisplay = customRepos || defaultRepos;

  const filteredRepos = reposToDisplay.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.primary_language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearching(true);

    fetch('http://localhost:8000/api/v1/research/github-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchTerm, limit: 6 })
    })
      .then(res => res.json())
      .then(data => {
        setCustomRepos(data);
        setSearching(false);
      })
      .catch(() => {
        setSearching(false);
      });
  };

  const handleCopyLink = (repo: GitHubRepository) => {
    navigator.clipboard.writeText(repo.html_url);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* GitHub In-App Detail Drawer */}
      {selectedRepo && (
        <GitHubRepoDrawer repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 p-6 rounded-2xl border border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-violet-400" />
            <span>Integrated GitHub Repository Explorer</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover open-source codebases with in-app README rendering, file tree inspection, and commit tracking.
          </p>
        </div>

        {/* Live Search Form */}
        <form onSubmit={handleSearchLive} className="flex items-center space-x-2">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search GitHub repositories..."
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button type="submit" size="sm" disabled={searching} className="text-xs h-9 bg-violet-600 hover:bg-violet-700">
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Repo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map((repo) => (
          <Card key={repo.id} className="glass-panel border-border/60 hover:border-violet-500/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  {repo.owner_avatar ? (
                    <img src={repo.owner_avatar} alt={repo.owner} className="w-7 h-7 rounded-full border border-border shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {repo.owner[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-mono text-muted-foreground">{repo.owner}</span>
                </div>

                <Badge variant="purple" className="text-[10px] font-mono">
                  {(repo.relevance_score * 100).toFixed(0)}% Match
                </Badge>
              </div>

              <div>
                <CardTitle className="text-base font-bold text-foreground leading-snug">{repo.name}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                  {repo.description}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Metrics & Badges */}
              <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {repo.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-sky-400">
                  <GitFork className="w-3.5 h-3.5" /> {repo.forks.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-violet-400">
                  <Code className="w-3.5 h-3.5" /> {repo.primary_language}
                </span>
              </div>

              {/* Topics */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {repo.topics.map((topic, i) => (
                    <span key={i} className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded font-mono">
                      #{topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Card Actions */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedRepo(repo)}
                  className="text-xs h-8 gap-1.5 bg-violet-600 hover:bg-violet-700 flex-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(repo)}
                  className="text-xs h-8 gap-1"
                >
                  {copiedId === repo.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-violet-400" />
                  )}
                  <span>{copiedId === repo.id ? 'Copied' : 'Copy'}</span>
                </Button>

                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm" className="text-xs h-8 p-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
