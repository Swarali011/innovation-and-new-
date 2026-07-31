import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  BookOpen, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Cpu, 
  FileCheck,
  GitBranch,
  Rocket,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useProject } from '../context/ProjectContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const { projects, activeProject, setActiveProject } = useProject();
  const navigate = useNavigate();

  const radarData = [
    { metric: 'Originality', value: activeProject?.scores?.originality || 94 },
    { metric: 'Feasibility', value: activeProject?.scores?.feasibility || 88 },
    { metric: 'Impact', value: activeProject?.scores?.impact || 95 },
    { metric: 'Novelty', value: activeProject?.scores?.novelty || 93 },
    { metric: 'Architecture', value: 90 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-950/60 via-purple-900/40 to-indigo-950/60 border border-violet-500/20 glass-panel-glow">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">AI Research & Innovation Co-Pilot</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Research Workspace & Innovation Dashboard
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Analyze project ideas, view embedded research paper PDFs, explore GitHub codebases, and generate AI implementation roadmaps.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="gradient" onClick={() => navigate('/new-project')} className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4" />
            <span>New Project Pipeline</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Pipelines</p>
              <h3 className="text-2xl font-bold text-foreground">{projects.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg. Innovation Score</p>
              <h3 className="text-2xl font-bold text-foreground">91.8 / 100</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Research Workspace</p>
              <h3 className="text-2xl font-bold text-foreground">Semantic Scholar</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">AI Implementation</p>
              <h3 className="text-2xl font-bold text-foreground">5-Phase Roadmap</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/workspace')}
          className="glass-panel p-5 rounded-xl border border-border/60 hover:border-violet-500/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Paper Workspace</h3>
          <p className="text-xs text-muted-foreground">Embedded PDF viewing, DOI, citation count & copy features.</p>
        </div>

        <div
          onClick={() => navigate('/github')}
          className="glass-panel p-5 rounded-xl border border-border/60 hover:border-violet-500/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-foreground">GitHub Explorer</h3>
          <p className="text-xs text-muted-foreground">In-app README viewer, repository tree, and commit history.</p>
        </div>

        <div
          onClick={() => navigate('/roadmap')}
          className="glass-panel p-5 rounded-xl border border-border/60 hover:border-violet-500/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Rocket className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-foreground">AI Implementation Roadmap</h3>
          <p className="text-xs text-muted-foreground">Interactive 5-phase timeline, deliverables, and PDF export.</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Project Highlight & Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          {activeProject && (
            <Card className="glass-panel border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="font-mono">Active Project</Badge>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Completed
                  </span>
                </div>
                <CardTitle className="text-xl font-bold mt-2">{activeProject.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{activeProject.rawIdea}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Domain</p>
                    <p className="font-semibold text-foreground truncate">{activeProject.domain}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Innovation Score</p>
                    <p className="font-semibold text-violet-400">{activeProject.innovationScore} / 100</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Papers Analyzed</p>
                    <p className="font-semibold text-foreground">{activeProject.papers?.length || 3}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                    <p className="text-[10px] text-muted-foreground">Gaps Identified</p>
                    <p className="font-semibold text-foreground">{activeProject.gaps?.length || 3}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/workspace')}>
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-violet-400" /> Literature Workspace
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/github')}>
                    <GitBranch className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> GitHub Explorer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/roadmap')}>
                    <Rocket className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> AI Implementation Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Pipelines Table */}
          <Card className="glass-panel">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Innovation Pipelines</CardTitle>
                <CardDescription className="text-xs">Past multi-agent pipeline executions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-xs">
                View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setActiveProject(proj)}
                    className="p-3.5 rounded-xl border border-border/60 bg-card/60 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1 min-w-0 pr-4">
                      <h4 className="text-xs font-semibold text-foreground truncate">{proj.title}</h4>
                      <p className="text-[11px] text-muted-foreground truncate">{proj.domain}</p>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <Badge variant="purple" className="font-mono text-[10px]">
                        {proj.innovationScore} pts
                      </Badge>
                      <Badge variant="success" className="text-[10px]">
                        {proj.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Innovation Score Radar Chart */}
        <div className="space-y-6">
          <Card className="glass-panel h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Innovation Score Radar</span>
              </CardTitle>
              <CardDescription className="text-xs">Multi-dimensional evaluation breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full text-center pt-2 border-t border-border/40">
                <p className="text-xs font-medium text-foreground">
                  Overall Originality Index: <span className="text-violet-400 font-bold">92.5 / 100</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
