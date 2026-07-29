import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  BrainCircuit, 
  Cpu, 
  Zap, 
  Layers, 
  FileText 
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';

const domains = [
  'Artificial Intelligence & Software Engineering',
  'Robotics & Computer Vision',
  'Blockchain & Distributed Systems',
  'Healthcare & Medical AI',
  'Cybersecurity & Privacy',
  'Quantum Computing & Information'
];

export const NewProjectPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [idea, setIdea] = useState('');
  const [domain, setDomain] = useState(domains[0]);
  const [targetAudience, setTargetAudience] = useState('');
  const { createNewProject, runPipeline, pipelineSteps, isPipelineRunning } = useProject();
  const navigate = useNavigate();

  const handleRunPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !idea) return;

    const newProj = await createNewProject(title, idea, domain, targetAudience);
    await runPipeline(newProj.id);
    navigate('/workspace');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <span>New Research & Innovation Pipeline</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter a simple project idea. Our 5-agent LangGraph orchestrator will build a peer-reviewed research & system architecture blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Wizard */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass-panel">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Project Definition</CardTitle>
              <CardDescription className="text-xs">Describe your raw project concept or hypothesis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRunPipeline} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Project Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Autonomous Multi-Agent AI Research Copilot"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Domain Field</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {domains.map((d) => (
                      <option key={d} value={d} className="bg-card text-foreground">{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Raw Idea Description</label>
                  <Textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe what you want to build, key objectives, and any technical constraints..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Audience (Optional)</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. CS Researchers, Enterprise R&D teams"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isPipelineRunning || !title || !idea}
                  className="w-full h-11 font-semibold flex items-center justify-center space-x-2 mt-4"
                >
                  {isPipelineRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Orchestrating 5 LangGraph Agents...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Run Multi-Agent Pipeline</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Agent Pipeline State Tracker */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-panel border-violet-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-violet-400" />
                  <span>Agent Execution Graph</span>
                </CardTitle>
                <Badge variant="purple" className="font-mono text-[10px]">LangGraph</Badge>
              </div>
              <CardDescription className="text-xs">
                Real-time SSE progress of autonomous sub-agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative">
                {pipelineSteps.map((step, idx) => {
                  const isCompleted = step.status === 'completed';
                  const isInProgress = step.status === 'in_progress';

                  return (
                    <div key={step.id} className="relative flex items-start space-x-3">
                      {/* Vertical Connecting Line */}
                      {idx !== pipelineSteps.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                            isCompleted ? 'bg-violet-500' : 'bg-border/60'
                          }`}
                        />
                      )}

                      {/* Icon status indicator */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isInProgress
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 animate-pulse'
                            : 'bg-muted/40 text-muted-foreground border border-border/60'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isInProgress ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-foreground">{step.name}</h4>
                          <span className="text-[9px] font-mono text-muted-foreground">{step.agentName}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">{step.description}</p>
                        {step.outputSummary && (
                          <div className="p-2 rounded bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 mt-1">
                            {step.outputSummary}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
