import React from 'react';
import { BarChart3, Sparkles, Award, ShieldCheck, Zap } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const InnovationScoringPage: React.FC = () => {
  const { activeProject } = useProject();
  const scores = activeProject?.scores || {
    originality: 94.0,
    feasibility: 88.0,
    impact: 95.0,
    novelty: 93.0,
    overallScore: 92.5
  };

  const barData = [
    { metric: 'Originality', score: scores.originality },
    { metric: 'Feasibility', score: scores.feasibility },
    { metric: 'Impact', score: scores.impact },
    { metric: 'Novelty', score: scores.novelty },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-violet-400" />
          <span>Innovation Scoring & Novelty Metrics</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Calculated by Innovation Generator Agent using multi-variable evaluation algorithms.
        </p>
      </div>

      {/* Score Hero Badge */}
      <Card className="glass-panel bg-gradient-to-r from-violet-950/40 via-purple-900/30 to-indigo-950/40 border-violet-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="purple" className="font-mono">Comprehensive Rating</Badge>
          <h2 className="text-3xl font-extrabold text-foreground">
            Overall Innovation Score: <span className="gradient-text">{scores.overallScore} / 100</span>
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            This project ranks in the top 5% of original research concepts. High impact potential with low technical implementation risk.
          </p>
        </div>
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex flex-col items-center justify-center text-white shadow-xl shadow-violet-500/20 shrink-0">
          <Award className="w-8 h-8" />
          <span className="text-xs font-bold mt-1 font-mono">Grade A+</span>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">Metric Bar Breakdown</CardTitle>
            <CardDescription className="text-xs">Individual component rating distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Unique Feature Solutions */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">Originality Boost Features</CardTitle>
            <CardDescription className="text-xs">Proprietary innovations proposed by Innovation Generator Agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeProject?.solutions?.map((sol) => (
              <div key={sol.id} className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">{sol.featureName}</h4>
                  <Badge variant="purple" className="text-[10px] font-mono">{sol.noveltyScore} Novelty</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{sol.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
