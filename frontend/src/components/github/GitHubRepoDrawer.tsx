import React, { useState, useEffect } from 'react';
import {
  Star,
  GitFork,
  CircleDot,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileText,
  Folder,
  GitCommit,
  Activity,
  Code,
} from "lucide-react";
import { GitHubRepository, GitHubRepoDetails } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface GitHubRepoDrawerProps {
  repo: GitHubRepository | null;
  onClose: () => void;
}

export const GitHubRepoDrawer: React.FC<GitHubRepoDrawerProps> = ({ repo, onClose }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'tree' | 'commits' | 'stats'>('readme');
  const [details, setDetails] = useState<GitHubRepoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!repo) return;
    setLoading(true);
    fetch(`http://localhost:8000/api/v1/research/github-details?owner=${repo.owner}&repo=${repo.name}`)
      .then(res => res.json())
      .then(data => {
        setDetails(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mockup details
        setDetails({
          owner: repo.owner,
          repo: repo.name,
          full_name: repo.full_name,
          readme_md: `# ${repo.name}\n\n${repo.description}\n\n## Quick Start\n\`\`\`bash\ngit clone ${repo.html_url}.git\ncd ${repo.name}\nnpm install && npm run dev\n\`\`\`\n\n## Features\n- Modular Architecture\n- Real-time event streaming\n- Comprehensive unit & E2E tests`,
          file_tree: [
            { path: 'src', type: 'dir' },
            { path: 'src/components', type: 'dir' },
            { path: 'src/main.ts', type: 'file' },
            { path: 'src/config.ts', type: 'file' },
            { path: 'README.md', type: 'file' },
            { path: 'package.json', type: 'file' }
          ],
          languages: { [repo.primary_language]: 80, 'Other': 20 },
          commits: [
            { sha: 'a8f12c9', message: 'feat: add agentic cycle state persistence', author: repo.owner, date: '2026-07-30' },
            { sha: 'b39d10e', message: 'docs: update deployment guidelines', author: repo.owner, date: '2026-07-28' }
          ],
          open_issues: repo.open_issues || 12,
          stars: repo.stars,
          forks: repo.forks,
          html_url: repo.html_url
        });
        setLoading(false);
      });
  }, [repo]);

  if (!repo) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(repo.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border-l border-border/80 w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-border/60 bg-muted/30 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 min-w-0 pr-4">
              {repo.owner_avatar ? (
                <img src={repo.owner_avatar} alt={repo.owner} className="w-10 h-10 rounded-full border border-border shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold shrink-0">
                  {repo.owner[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground truncate">{repo.full_name}</h2>
                  <Badge variant="purple" className="text-[10px] font-mono shrink-0">
                    {repo.primary_language}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{repo.description}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {repo.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <GitFork className="w-3.5 h-3.5" /> {repo.forks.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> {repo.license}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="text-xs h-7 gap-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-400" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                <Button size="sm" className="text-xs h-7 gap-1 bg-violet-600 hover:bg-violet-700">
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="flex border-b border-border/40 space-x-6 pt-2">
            {[
              { id: 'readme', label: 'README.md', icon: FileText },
              { id: 'tree', label: 'File Tree', icon: Folder },
              { id: 'commits', label: 'Commits', icon: GitCommit },
              { id: 'stats', label: 'Activity & Stats', icon: Activity }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-violet-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Main Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Fetching in-app repository details...</p>
            </div>
          ) : (
            <>
              {activeTab === 'readme' && (
                <div className="prose prose-invert prose-xs max-w-none space-y-4">
                  <pre className="bg-muted/40 p-4 rounded-xl border border-border/60 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {details?.readme_md || 'No README documentation available.'}
                  </pre>
                </div>
              )}

              {activeTab === 'tree' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Repository Folder Hierarchy</h4>
                  <div className="bg-card/60 border border-border/60 rounded-xl p-3 divide-y divide-border/30 font-mono text-xs">
                    {details?.file_tree.map((node, i) => (
                      <div key={i} className="py-2 px-2 flex items-center space-x-2.5 hover:bg-muted/30 rounded transition-colors">
                        {node.type === 'dir' ? (
                          <Folder className="w-4 h-4 text-violet-400" />
                        ) : (
                          <Code className="w-4 h-4 text-emerald-400" />
                        )}
                        <span className={node.type === 'dir' ? 'font-bold text-foreground' : 'text-muted-foreground'}>
                          {node.path}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'commits' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recent Commit Log</h4>
                  {details?.commits.map((c, idx) => (
                    <div key={idx} className="p-3 bg-card/60 rounded-xl border border-border/60 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground leading-snug">{c.message}</p>
                        <p className="text-[11px] text-muted-foreground">
                          By <span className="text-violet-400">{c.author}</span> on {c.date}
                        </p>
                      </div>
                      <Badge variant="purple" className="font-mono text-[10px] shrink-0">
                        {c.sha}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                      <p className="text-xs text-muted-foreground">Open Issues</p>
                      <p className="text-xl font-bold text-foreground flex items-center gap-2">
                        <CircleDot className="w-5 h-5 text-amber-400" />
                        {details?.open_issues}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                      <p className="text-xs text-muted-foreground">Stargazers</p>
                      <p className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        {details?.stars.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-card/60 rounded-xl border border-border/60 space-y-3">
                    <h5 className="text-xs font-bold text-foreground">Language Distribution</h5>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                      <div className="bg-violet-500 h-full w-[70%]" title="Python" />
                      <div className="bg-emerald-500 h-full w-[20%]" title="TypeScript" />
                      <div className="bg-amber-500 h-full w-[10%]" title="Other" />
                    </div>
                    <div className="flex space-x-4 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Python (70%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> TypeScript (20%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Other (10%)</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
