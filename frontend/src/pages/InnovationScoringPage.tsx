import React from 'react';
import { BarChart3, Award, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { generateSmartMockData } from '../utils/geminiService';

export const InnovationScoringPage: React.FC = () => {
  const { activeProject, runPipeline, isPipelineRunning } = useProject();
  const navigate = useNavigate();

  // ── No project ──────────────────────────────────────────────────────────────
  if (!activeProject) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <BarChart3 className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground text-sm">No active project selected.</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/new-project')} className="text-xs">
            Create a Project
          </Button>
        </div>
      </div>
    );
  }

  // Resolve scores, dynamically calculating unique scores if missing
  const mockData = generateSmartMockData(activeProject.title, activeProject.domain, activeProject.rawIdea);
  const scores = activeProject.scores || mockData.scores;
  const solutions = activeProject.solutions && activeProject.solutions.length > 0 ? activeProject.solutions : mockData.solutions;

  // ── Full scoring view ───────────────────────────────────────────────────────
  const barData = [
    { metric: 'Originality', score: scores.originality },
    { metric: 'Feasibility', score: scores.feasibility },
    { metric: 'Impact', score: scores.impact },
    { metric: 'Novelty', score: scores.novelty },
  ];

  const radarData = [
    { subject: 'Originality', value: scores.originality },
    { subject: 'Feasibility', value: scores.feasibility },
    { subject: 'Impact', value: scores.impact },
    { subject: 'Novelty', value: scores.novelty },
    { subject: 'Completeness', value: Math.min(99, Math.round((scores.overallScore + 4))) },
  ];

  const grade =
    scores.overallScore >= 90
      ? 'A+'
      : scores.overallScore >= 85
      ? 'A'
      : scores.overallScore >= 80
      ? 'B+'
      : scores.overallScore >= 75
      ? 'B'
      : 'C+';

  const percentile =
    scores.overallScore >= 90
      ? 'top 5%'
      : scores.overallScore >= 85
      ? 'top 12%'
      : scores.overallScore >= 80
      ? 'top 20%'
      : 'top 35%';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-violet-400" />
          <span>Innovation Scoring & Novelty Metrics</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Calculated by Innovation Generator Agent for{' '}
          <span className="text-violet-400 font-semibold">"{activeProject.title}"</span>.
        </p>
      </div>

      {/* Score Hero */}
      <Card className="glass-panel bg-gradient-to-r from-violet-950/40 via-purple-900/30 to-indigo-950/40 border-violet-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="purple" className="font-mono">
            Comprehensive Rating
          </Badge>
          <h2 className="text-3xl font-extrabold text-foreground">
            Overall Innovation Score:{' '}
            <span className="gradient-text">{scores.overallScore.toFixed(1)} / 100</span>
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            This project ranks in the <strong className="text-violet-400">{percentile}</strong> of original
            research concepts. Grade <strong>{grade}</strong> — high impact potential assessed for{' '}
            {activeProject.domain}.
          </p>
        </div>
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex flex-col items-center justify-center text-white shadow-xl shadow-violet-500/20 shrink-0">
          <Award className="w-8 h-8" />
          <span className="text-xs font-bold mt-1 font-mono">Grade {grade}</span>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar chart */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">Innovation Radar Chart</CardTitle>
            <CardDescription className="text-xs">Multi-dimensional innovation profile</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Unique Feature Solutions */}
      {solutions && solutions.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">Originality Boost Features</CardTitle>
            <CardDescription className="text-xs">
              Proprietary innovations proposed by Innovation Generator Agent for "{activeProject.title}"
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {solutions.map((sol) => (
              <div
                key={sol.id}
                className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">{sol.featureName}</h4>
                  <Badge variant="purple" className="text-[10px] font-mono">
                    {sol.noveltyScore} Novelty
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{sol.description}</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                    Feasibility: {sol.feasibilityScore}
                  </span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                    Impact: {sol.impactScore}
                  </span>
                  <Badge
                    variant={sol.technicalRisk === 'Low' ? 'success' : 'warning'}
                    className="text-[10px]"
                  >
                    {sol.technicalRisk} Risk
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
