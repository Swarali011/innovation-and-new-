import React, { useState } from 'react';
import { BookOpen, ExternalLink, Search, Sparkles, Filter, CheckCircle2, Bookmark } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ResearchWorkspacePage: React.FC = () => {
  const { activeProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const papers = activeProject?.papers || [];

  const filteredPapers = papers.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-400" />
            <span>Research Workspace & Literature Survey</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Academic literature searched and summarized by Research Intelligence Agent (ArXiv & Semantic Scholar).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search paper abstracts..."
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Papers List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="glass-panel border-border/60 hover:border-violet-500/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="purple" className="text-[10px] uppercase font-mono">
                    {paper.source} • {paper.publishedYear}
                  </Badge>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {(paper.relevanceScore * 100).toFixed(0)}% Match Relevance
                  </span>
                </div>
                <CardTitle className="text-base font-bold leading-snug mt-1.5">{paper.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Authors: <span className="text-foreground">{paper.authors.join(', ')}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/40">
                  {paper.abstract}
                </p>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Key Academic Findings
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    {paper.keyFindings.map((finding, i) => (
                      <li key={i} className="leading-tight">{finding}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-violet-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Full Paper on {paper.source}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    <Bookmark className="w-3.5 h-3.5 mr-1" /> Save Citation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Literature Survey Stats */}
        <div className="space-y-6">
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Literature Summary</CardTitle>
              <CardDescription className="text-xs">Synthesized by LangGraph Research Agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                <p className="font-semibold text-foreground mb-1">State-of-the-Art Analysis</p>
                Target literature indicates strong theoretical foundations in cyclical state-machine agent execution (LangGraph) and high-dimensional FAISS vector retrieval.
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Indexed Sources Breakdown</p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between p-2 rounded bg-muted/40">
                    <span>ArXiv CS.AI Repository</span>
                    <span className="font-bold text-foreground">2 Papers</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/40">
                    <span>Semantic Scholar Corpus</span>
                    <span className="font-bold text-foreground">1 Paper</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
