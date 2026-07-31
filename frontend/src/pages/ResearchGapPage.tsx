import React from 'react';
import { Sparkles, Lightbulb, AlertCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { generateSmartMockData } from '../utils/geminiService';

export const ResearchGapPage: React.FC = () => {
  const { activeProject, runPipeline, isPipelineRunning } = useProject();
  const navigate = useNavigate();

  // Empty states
  if (!activeProject) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground text-sm">No active project selected.</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/new-project')} className="text-xs">
            Create a Project
          </Button>
        </div>
      </div>
    );
  }

  // Retrieve project gaps, falling back dynamically to smart generated gaps if empty
  const rawGaps = activeProject.gaps && activeProject.gaps.length > 0
    ? activeProject.gaps
    : generateSmartMockData(activeProject.title, activeProject.domain, activeProject.rawIdea).gaps;

  // Normalize gaps to ensure camelCase properties exist regardless of source format
  const gaps = rawGaps.map((g: any, idx: number) => ({
    id: g.id || `gap-${idx}`,
    category: g.category || 'technical',
    description: g.description || 'Current baseline SOTA limitation in domain applicability.',
    proposedSolution: g.proposedSolution || g.proposed_solution || 'Adaptive engine architecture with drift correction.',
    impactLevel: g.impactLevel || g.impact_level || 'High',
    noveltyRating: g.noveltyRating ?? g.novelty_rating ?? 85,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <span>Research Gap Analysis & Novelty Matrix</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Identified by Research Intelligence Agent & Innovation Generator Agent to maximize project originality for{' '}
          <span className="text-violet-400 font-semibold">"{activeProject.title}"</span>.
        </p>
      </div>

      {/* Gap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gaps.map((gap) => (
          <Card key={gap.id} className="glass-panel border-border/60 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    gap.category === 'technical'
                      ? 'purple'
                      : gap.category === 'methodological'
                      ? 'default'
                      : 'secondary'
                  }
                  className="uppercase font-mono text-[10px]"
                >
                  {gap.category.replace('_', ' ')} Gap
                </Badge>
                <span className="text-xs font-bold text-violet-400">{gap.noveltyRating}% Novelty</span>
              </div>
              <CardTitle className="text-sm font-bold mt-2 leading-snug">{gap.description}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" /> Proposed Innovation
                </p>
                <p className="text-xs text-foreground leading-relaxed">{gap.proposedSolution}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                <span className="text-muted-foreground">Impact Level:</span>
                <Badge variant={gap.impactLevel === 'High' ? 'success' : 'warning'}>
                  {gap.impactLevel} Impact
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Novelty Comparison Matrix */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-base">Novelty & Research Opportunity Matrix</CardTitle>
          <CardDescription className="text-xs">
            Comparative evaluation against current SOTA baseline — project: "{activeProject.title}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Gap Dimension</th>
                  <th className="py-2.5 px-3">Current SOTA Limitation</th>
                  <th className="py-2.5 px-3">Our Innovation Solution</th>
                  <th className="py-2.5 px-3 text-center">Impact</th>
                  <th className="py-2.5 px-3 text-right">Novelty Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {gaps.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-foreground capitalize">{g.category.replace('_', ' ')}</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-xs">{g.description}</td>
                    <td className="py-3 px-3 text-violet-300 font-medium max-w-xs">{g.proposedSolution}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={g.impactLevel === 'High' ? 'success' : 'warning'} className="text-[10px]">
                        {g.impactLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-violet-400 font-mono">
                      {g.noveltyRating}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
