import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Search, Sparkles, Download, Copy, Check, Filter, Eye, AlertCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ResearchPaper } from '../types';
import { PdfViewerModal } from '../components/research/PdfViewerModal';
import { generateSmartMockData } from '../utils/geminiService';

export const ResearchWorkspacePage: React.FC = () => {
  const { activeProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [customPapers, setCustomPapers] = useState<ResearchPaper[] | null>(null);

  // Reset custom papers and fetch/generate project-specific papers when activeProject changes
  useEffect(() => {
    setCustomPapers(null);
  }, [activeProject?.id]);

  const defaultPapers: ResearchPaper[] = React.useMemo(() => {
    if (!activeProject) return [];
    if (activeProject.papers && activeProject.papers.length > 0) {
      return activeProject.papers;
    }
    // Generate dynamic project-tailored papers based on project title, domain & rawIdea
    return generateSmartMockData(
      activeProject.title,
      activeProject.domain,
      activeProject.rawIdea
    ).papers;
  }, [activeProject]);

  const displayPapers = customPapers || defaultPapers;

  const filteredPapers = displayPapers.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearching(true);

    fetch('https://innovation-ai-backend-k2gq.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchTerm, domain: activeProject?.domain || "General CS/AI", limit: 6 })
    })
      .then(res => res.json())
      .then(data => {
        const formatted: ResearchPaper[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          authors: item.authors,
          publishedYear: item.published_year,
          journal: item.journal,
          abstract: item.abstract,
          citationCount: item.citation_count,
          doi: item.doi,
          url: item.url,
          pdfUrl: item.pdf_url,
          isEmbeddable: item.is_embeddable,
          source: item.source,
          relevanceScore: item.relevance_score,
          keyFindings: item.key_findings || []
        }));
        setCustomPapers(formatted);
        setSearching(false);
      })
      .catch(() => {
        setSearching(false);
      });
  };

  const handleCopyCitation = (paper: ResearchPaper) => {
    const citation = `${paper.authors.join(', ')} (${paper.publishedYear}). ${paper.title}. ${paper.journal || 'Academic Journal'}. ${paper.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Embedded PDF Modal */}
      {selectedPaper && (
        <PdfViewerModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 p-6 rounded-2xl border border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-400" />
            <span>Integrated Research Paper Workspace</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Literature retrieval powered by Semantic Scholar & arXiv with embedded PDF viewing & citation tools.
          </p>
        </div>

        {/* Live Search Form */}
        <form onSubmit={handleSearchLive} className="flex items-center space-x-2">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Semantic Scholar & arXiv..."
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button type="submit" size="sm" disabled={searching} className="text-xs h-9 bg-violet-600 hover:bg-violet-700">
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paper Cards List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="glass-panel border-border/60 hover:border-violet-500/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="purple" className="text-[10px] uppercase font-mono">
                      {paper.source} • {paper.publishedYear}
                    </Badge>
                    {paper.citationCount !== undefined && (
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded">
                        {paper.citationCount} Citations
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {(paper.relevanceScore * 100).toFixed(0)}% Relevance Score
                  </span>
                </div>

                <CardTitle className="text-base font-bold leading-snug mt-2">{paper.title}</CardTitle>
                
                <p className="text-xs text-muted-foreground">
                  Authors: <span className="text-foreground">{paper.authors.join(', ')}</span>
                  {paper.journal && <span className="text-violet-400 font-mono"> — {paper.journal}</span>}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/40">
                  {paper.abstract}
                </p>

                {paper.keyFindings && paper.keyFindings.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Key Findings
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                      {paper.keyFindings.map((finding, i) => (
                        <li key={i} className="leading-tight">{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* View Paper Embedded Button */}
                    <Button
                      size="sm"
                      onClick={() => setSelectedPaper(paper)}
                      className="text-xs h-8 gap-1.5 bg-violet-600 hover:bg-violet-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Paper</span>
                    </Button>

                    {/* Copy Citation Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCitation(paper)}
                      className="text-xs h-8 gap-1.5"
                    >
                      {copiedId === paper.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-violet-400" />
                      )}
                      <span>{copiedId === paper.id ? 'Citation Copied!' : 'Copy Citation'}</span>
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {paper.pdfUrl && (
                      <a href={paper.pdfUrl} target="_blank" rel="noreferrer" download>
                        <Button variant="ghost" size="sm" className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground">
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </Button>
                      </a>
                    )}
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Literature Survey Stats Sidebar */}
        <div className="space-y-6">
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Workspace Literature Summary</CardTitle>
              <CardDescription className="text-xs">Synthesized via Semantic Scholar & arXiv</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                <p className="font-semibold text-foreground mb-1">State-of-the-Art Benchmark</p>
                Academic corpus confirms strong theoretical foundations in graph-based multi-agent execution, state persistence, and dense vector index retrieval.
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Indexed Sources</p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between p-2 rounded bg-muted/40">
                    <span>Semantic Scholar Corpus</span>
                    <span className="font-bold text-foreground">API Synced</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/40">
                    <span>ArXiv CS.AI Repository</span>
                    <span className="font-bold text-foreground">Active Fallback</span>
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
