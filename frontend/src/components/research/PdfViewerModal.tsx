import React, { useState } from 'react';
import { X, ExternalLink, Download, Copy, Check, ZoomIn, ZoomOut, AlertTriangle, BookOpen } from 'lucide-react';
import { ResearchPaper } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PdfViewerModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ paper, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [embedError, setEmbedError] = useState(false);

  if (!paper) return null;

  const pdfUrl = paper.pdfUrl || paper.url;
  const isDirectPdf = pdfUrl.includes('.pdf') || paper.source === 'arxiv' || paper.isEmbeddable;

  const handleCopyCitation = () => {
    const authorsStr = paper.authors.join(', ');
    const citation = `${authorsStr} (${paper.publishedYear}). ${paper.title}. ${paper.journal || 'Academic Literature'}. ${paper.doi ? 'https://doi.org/' + paper.doi : paper.url}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border/60 bg-muted/40">
          <div className="flex items-center space-x-3 min-w-0 pr-4">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground truncate">{paper.title}</h3>
                <Badge variant="purple" className="text-[10px] shrink-0 font-mono">
                  {paper.source} • {paper.publishedYear}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {paper.authors.join(', ')} • {paper.journal || 'Academic Journal'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Zoom Controls */}
            {isDirectPdf && !embedError && (
              <div className="hidden md:flex items-center space-x-1 bg-background/80 border border-border/60 rounded-lg p-1 mr-2 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 15, 65))}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <span className="px-1 font-mono text-[11px] text-muted-foreground w-10 text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 15, 150))}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCitation}
              className="text-xs h-8 gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-400" />}
              <span>{copied ? 'Citation Copied!' : 'Copy Citation'}</span>
            </Button>

            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noreferrer" download>
                <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
              </a>
            )}

            <a href={paper.url} target="_blank" rel="noreferrer">
              <Button size="sm" className="text-xs h-8 gap-1.5 bg-violet-600 hover:bg-violet-700">
                <span>Open Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Viewer */}
        <div className="flex-1 bg-background relative overflow-hidden flex flex-col justify-center">
          {isDirectPdf && !embedError ? (
            <div className="w-full h-full overflow-auto flex justify-center bg-zinc-900/60 p-2">
              <div 
                className="w-full h-full transition-transform duration-150 origin-top"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <iframe
                  src={pdfUrl.includes('arxiv.org/abs/') ? pdfUrl.replace('/abs/', '/pdf/') + '.pdf' : pdfUrl}
                  title={paper.title}
                  className="w-full h-full rounded border-0"
                  onError={() => setEmbedError(true)}
                />
              </div>
            </div>
          ) : (
            /* Publisher Restrictions Fallback Panel */
            <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-amber-200 text-sm mb-1">
                    Publisher Embedded Viewing Restrictions
                  </p>
                  This paper's host publisher does not permit direct iframe embedding due to CORS or security policies. You can view the paper details and abstract below or click <strong>Open Original Source</strong> to read the complete article on the publisher website.
                </div>
              </div>

              {/* Paper Metadata Summary */}
              <div className="space-y-4 bg-card/60 p-6 rounded-xl border border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <Badge variant="success" className="text-xs">
                    {(paper.relevanceScore * 100).toFixed(0)}% Relevance Match
                  </Badge>
                  {paper.doi && (
                    <span className="text-xs font-mono text-muted-foreground">
                      DOI: <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">{paper.doi}</a>
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground leading-snug">{paper.title}</h2>
                  <p className="text-sm text-violet-400 mt-1">Authors: {paper.authors.join(', ')}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    Published in: {paper.journal || 'Academic Literature'} ({paper.publishedYear})
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Abstract</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-4 rounded-lg border border-border/40">
                    {paper.abstract}
                  </p>
                </div>

                {paper.keyFindings && paper.keyFindings.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Academic Findings</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {paper.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <a href={paper.url} target="_blank" rel="noreferrer">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700 gap-2 text-sm">
                    <span>Open Original Source Paper</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
