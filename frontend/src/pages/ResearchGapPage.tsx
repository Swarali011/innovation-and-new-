import React from 'react';
import { Sparkles, Lightbulb, Target, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ResearchGapPage: React.FC = () => {
  const { activeProject } = useProject();
  const gaps = activeProject?.gaps || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <span>Research Gap Analysis & Novelty Matrix</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Identified by Research Intelligence Agent & Innovation Generator Agent to maximize project originality.
        </p>
      </div>

      {/* Gap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gaps.map((gap) => (
          <Card key={gap.id} className="glass-panel border-border/60 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={gap.category === 'technical' ? 'purple' : gap.category === 'methodological' ? 'default' : 'secondary'}
                  className="uppercase font-mono text-[10px]"
                >
                  {gap.category} Gap
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
          <CardDescription className="text-xs">Comparative evaluation against current SOTA baseline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Gap Dimension</th>
                  <th className="py-2.5 px-3">Current SOTA Limit</th>
                  <th className="py-2.5 px-3">Our Innovation Solution</th>
                  <th className="py-2.5 px-3 text-center">Impact</th>
                  <th className="py-2.5 px-3 text-right">Novelty Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {gaps.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-foreground capitalize">{g.category}</td>
                    <td className="py-3 px-3 text-muted-foreground">{g.description}</td>
                    <td className="py-3 px-3 text-violet-300 font-medium">{g.proposedSolution}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="success" className="text-[10px]">{g.impactLevel}</Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-violet-400 font-mono">{g.noveltyRating}/100</td>
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
