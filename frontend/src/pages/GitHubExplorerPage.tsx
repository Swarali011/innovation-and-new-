import React, { useState, useEffect, useCallback } from 'react';
import {
  GitBranch, ExternalLink, Search, Star, GitFork, Copy, Check, Eye, Code,
  Loader2, AlertCircle, Sparkles, RefreshCw, X, Layers, Package
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GitHubRepository } from '../types';
import { GitHubRepoDrawer } from '../components/github/GitHubRepoDrawer';

// ─── Keyword extractor from project context ──────────────────────────────────
function buildQueryFromProject(title: string, domain: string, rawIdea: string): string {
  const stopWords = new Set(['and', 'the', 'for', 'with', 'using', 'based', 'on', 'a', 'an', 'of', 'in', 'to', 'is', 'that', 'this', 'are', 'from', 'into']);
  const titleWords = title
    .split(/[\s\-_]+/)
    .filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()))
    .slice(0, 4);
  const domainWord = domain && domain !== 'General CS/AI' ? domain.split(/\s+/)[0] : '';
  const combined = [...new Set([...titleWords, domainWord])].filter(Boolean).join(' ');
  return combined || title;
}

// ─── Map a raw GitHub API item to our GitHubRepository type ─────────────────
function mapGitHubItem(item: any, index: number): GitHubRepository {
  const owner = item.owner?.login ?? 'unknown';
  const repoName = item.name ?? '';
  const licenseInfo = item.license ?? {};
  const maxScore = 0.97;
  const decay = 0.03;
  return {
    id: String(item.id ?? index),
    name: repoName,
    full_name: item.full_name ?? `${owner}/${repoName}`,
    description: item.description ?? `Open-source repository for ${repoName}.`,
    owner,
    owner_avatar: item.owner?.avatar_url ?? '',
    stars: item.stargazers_count ?? 0,
    forks: item.forks_count ?? 0,
    open_issues: item.open_issues_count ?? 0,
    primary_language: item.language ?? 'Unknown',
    topics: (item.topics ?? []).slice(0, 5),
    last_updated: (item.updated_at ?? '').slice(0, 10),
    license: licenseInfo.spdx_id ?? licenseInfo.name ?? 'N/A',
    html_url: item.html_url ?? `https://github.com/${owner}/${repoName}`,
    relevance_score: Math.max(0.5, parseFloat((maxScore - index * decay).toFixed(2))),
  };
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="glass-panel border border-border/50 rounded-2xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-muted/60" />
        <div className="w-24 h-3 rounded bg-muted/60" />
      </div>
      <div className="w-16 h-5 rounded-full bg-muted/50" />
    </div>
    <div className="space-y-2">
      <div className="w-3/4 h-4 rounded bg-muted/60" />
      <div className="w-full h-3 rounded bg-muted/40" />
      <div className="w-5/6 h-3 rounded bg-muted/40" />
    </div>
    <div className="flex gap-3">
      <div className="w-16 h-3 rounded bg-muted/50" />
      <div className="w-14 h-3 rounded bg-muted/50" />
      <div className="w-20 h-3 rounded bg-muted/50" />
    </div>
    <div className="flex gap-1.5 flex-wrap">
      {[1, 2, 3].map(i => <div key={i} className="w-14 h-4 rounded bg-muted/40" />)}
    </div>
    <div className="pt-3 border-t border-border/30 flex gap-2">
      <div className="flex-1 h-8 rounded-lg bg-muted/50" />
      <div className="w-20 h-8 rounded-lg bg-muted/40" />
      <div className="w-8 h-8 rounded-lg bg-muted/40" />
    </div>
  </div>
);

// ─── Main Page Component ──────────────────────────────────────────────────────
export const GitHubExplorerPage: React.FC = () => {
  const { activeProject, projects } = useProject();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [querySource, setQuerySource] = useState<'project' | 'manual' | 'none'>('none');

  // ── Core fetch: GitHub public API directly (no backend needed) ───────────
  const fetchRepos = useCallback(async (query: string, source: 'project' | 'manual') => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    setQuerySource(source);

    const encoded = encodeURIComponent(query.trim());
    const githubUrl = `https://api.github.com/search/repositories?q=${encoded}&sort=stars&order=desc&per_page=9`;

    try {
      const res = await fetch(githubUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (res.status === 403) {
        // Rate-limited — try topic search as a fallback query
        throw new Error('rate_limited');
      }
      if (!res.ok) throw new Error(`github_error_${res.status}`);

      const data = await res.json();
      const items: GitHubRepository[] = (data.items ?? []).map(mapGitHubItem);

      if (items.length === 0) {
        setError(`No repositories found for "${query}". Try a different keyword.`);
        setRepos([]);
      } else {
        setRepos(items);
      }
    } catch (err: any) {
      if (err?.message === 'rate_limited') {
        setError('GitHub API rate limit reached. Please wait a minute and try again.');
      } else {
        setError('Could not reach GitHub. Check your internet connection and try again.');
      }
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auto-load on active project change ──────────────────────────────────
  useEffect(() => {
    if (activeProject) {
      const q = buildQueryFromProject(
        activeProject.title,
        activeProject.domain,
        activeProject.rawIdea
      );
      setSearchTerm('');
      fetchRepos(q, 'project');
    } else if (projects.length === 0) {
      // No project at all — show generic AI repos
      fetchRepos('AI multi-agent system innovation', 'project');
    }
  }, [activeProject?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Manual search submit ─────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    fetchRepos(searchTerm.trim(), 'manual');
  };

  // ── Clear manual search → revert to project query ───────────────────────
  const handleClearSearch = () => {
    setSearchTerm('');
    if (activeProject) {
      const q = buildQueryFromProject(activeProject.title, activeProject.domain, activeProject.rawIdea);
      fetchRepos(q, 'project');
    }
  };

  // ── Copy link ────────────────────────────────────────────────────────────
  const handleCopyLink = (repo: GitHubRepository) => {
    navigator.clipboard.writeText(repo.html_url);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Detail Drawer */}
      {selectedRepo && (
        <GitHubRepoDrawer repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 p-6 rounded-2xl border border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-violet-400" />
            <span>GitHub Repository Explorer</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover open-source repos · in-app README rendering · file tree · commit history
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any topic, language, tool..."
              className="w-full pl-9 pr-8 h-9 text-xs bg-muted/60 border border-border/60 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/60 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={loading || !searchTerm.trim()}
            className="text-xs h-9 bg-violet-600 hover:bg-violet-700 gap-1.5 disabled:opacity-50"
          >
            {loading && querySource === 'manual' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            Search
          </Button>
        </form>
      </div>

      {/* ─── Active Project Context Banner ───────────────────────────────── */}
      {activeProject && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-violet-500/8 border border-violet-500/25 rounded-xl px-4 py-3">
          <div className="flex items-start gap-3 min-w-0">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-violet-300">
                {querySource === 'project'
                  ? 'Showing repos relevant to your active project'
                  : 'Custom search active'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                <span className="text-foreground font-medium">{activeProject.title}</span>
                {' · '}
                <span className="text-violet-400">{activeProject.domain}</span>
                {querySource === 'project' && (
                  <> · Query: <span className="font-mono text-emerald-400">"{currentQuery}"</span></>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {querySource === 'manual' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSearch}
                className="text-[10px] h-7 gap-1 border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
              >
                <RefreshCw className="w-3 h-3" />
                Back to project
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const q = buildQueryFromProject(activeProject.title, activeProject.domain, activeProject.rawIdea);
                fetchRepos(q, 'project');
              }}
              disabled={loading}
              className="text-[10px] h-7 gap-1 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* No active project notice */}
      {!activeProject && (
        <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/25 rounded-xl px-4 py-3">
          <Package className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-300">No active project selected</p>
            <p className="text-[11px] text-muted-foreground">
              Select a project from the sidebar or create a new one to get personalised repository suggestions.
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/25 rounded-xl px-4 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-300">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Search status line ───────────────────────────────────────────── */}
      {!loading && repos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Found <span className="text-foreground font-semibold">{repos.length}</span> repositories
            {currentQuery && (
              <> for <span className="font-mono text-violet-400">"{currentQuery}"</span></>
            )}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Layers className="w-3 h-3" />
            {querySource === 'project' ? 'Project-matched' : 'Custom search'} results
          </div>
        </div>
      )}

      {/* ─── Repository Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton loading cards
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : repos.length === 0 ? (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">No repositories found</p>
              <p className="text-xs text-muted-foreground">
                Try a different search term or refresh to use project context
              </p>
            </div>
            {activeProject && (
              <Button
                size="sm"
                onClick={() => {
                  const q = buildQueryFromProject(activeProject.title, activeProject.domain, activeProject.rawIdea);
                  fetchRepos(q, 'project');
                }}
                className="text-xs bg-violet-600 hover:bg-violet-700 gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load project suggestions
              </Button>
            )}
          </div>
        ) : (
          repos.map((repo) => (
            <Card
              key={repo.id}
              className="glass-panel border-border/60 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 flex flex-col justify-between group"
            >
              <CardHeader className="pb-2 space-y-3">
                {/* Owner + Match Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {repo.owner_avatar ? (
                      <img
                        src={repo.owner_avatar}
                        alt={repo.owner}
                        className="w-7 h-7 rounded-full border border-border shrink-0 group-hover:ring-2 group-hover:ring-violet-500/30 transition-all"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {repo.owner[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-mono text-muted-foreground truncate max-w-[120px]">{repo.owner}</span>
                  </div>
                  <Badge variant="purple" className="text-[10px] font-mono shrink-0">
                    {(repo.relevance_score * 100).toFixed(0)}% Match
                  </Badge>
                </div>

                {/* Repo Title + Description */}
                <div>
                  <CardTitle className="text-sm font-bold text-foreground leading-snug group-hover:text-violet-300 transition-colors">
                    {repo.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                    {repo.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* Metrics */}
                <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {repo.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-violet-400">
                    <Code className="w-3.5 h-3.5" />
                    {repo.primary_language}
                  </span>
                </div>

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 5).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-muted/60 hover:bg-violet-500/15 text-muted-foreground hover:text-violet-300 px-2 py-0.5 rounded font-mono cursor-pointer transition-colors"
                        onClick={() => {
                          setSearchTerm(topic);
                          fetchRepos(topic, 'manual');
                        }}
                        title={`Search for: ${topic}`}
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
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
          ))
        )}
      </div>
    </div>
  );
};
