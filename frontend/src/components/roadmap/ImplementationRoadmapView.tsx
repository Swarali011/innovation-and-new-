import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Clock, Wrench, AlertTriangle, Lightbulb, Download, Printer, Rocket } from 'lucide-react';
import { RoadmapPhase } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface ImplementationRoadmapViewProps {
  phases: RoadmapPhase[];
  projectTitle?: string;
}

export const ImplementationRoadmapView: React.FC<ImplementationRoadmapViewProps> = ({ phases: initialPhases, projectTitle = 'AI Innovation Project' }) => {
  const [phases, setPhases] = useState<RoadmapPhase[]>(initialPhases);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': true,
    'phase-2': true,
    'phase-3': false,
    'phase-4': false,
    'phase-5': false
  });

  const toggleExpand = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleComplete = (phaseId: string) => {
    setPhases(prev =>
      prev.map(p => {
        if (p.phase_id === phaseId) {
          const nextStatus = p.status === 'completed' ? 'pending' : 'completed';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const completedCount = phases.filter(p => p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (phases.length || 1)) * 100);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(phases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 p-6 rounded-2xl border border-border/60 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <Rocket className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-foreground">AI Implementation Roadmap</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Customized multi-phase execution timeline synthesized for <span className="text-foreground font-semibold">{projectTitle}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-3 print:hidden">
          <Button variant="outline" size="sm" onClick={handleExportJSON} className="text-xs h-8 gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </Button>
          <Button size="sm" onClick={handleExportPDF} className="text-xs h-8 gap-1.5 bg-violet-600 hover:bg-violet-700">
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="bg-card/40 p-4 rounded-xl border border-border/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span>Roadmap Completion Progress:</span>
            <span className="text-violet-400 font-bold">{completedCount} of {phases.length} Phases</span>
          </span>
          <span className="font-mono text-emerald-400">{progressPercent}% Completed</span>
        </div>
        <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Timeline Phases */}
      <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
        {phases.map((phase) => {
          const isExpanded = !!expandedPhases[phase.phase_id];
          const isCompleted = phase.status === 'completed';

          return (
            <div key={phase.phase_id} className="relative pl-12">
              {/* Timeline Marker */}
              <button
                onClick={() => toggleComplete(phase.phase_id)}
                className={`absolute left-3.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 ${
                  isCompleted
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                    : 'bg-card border-2 border-violet-500 text-violet-400 hover:border-emerald-400'
                }`}
                title={isCompleted ? 'Mark as incomplete' : 'Mark phase as complete'}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3.5 h-3.5" />}
              </button>

              {/* Phase Card */}
              <Card className={`glass-panel transition-all border ${isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/60 hover:border-violet-500/40'}`}>
                <CardHeader className="p-5 cursor-pointer select-none" onClick={() => toggleExpand(phase.phase_id)}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant={isCompleted ? 'emerald' : 'purple'} className="text-[11px] font-mono uppercase">
                        Phase {phase.phase_number}
                      </Badge>
                      <CardTitle className={`text-base font-bold ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {phase.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground font-mono bg-muted/40 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        {phase.estimated_duration}
                      </span>

                      <button className="p-1 text-muted-foreground hover:text-foreground">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="px-5 pb-5 pt-0 space-y-4 border-t border-border/40 mt-2">
                    {/* Deliverables */}
                    <div className="space-y-2 pt-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Phase Deliverables
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {phase.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 bg-muted/30 p-2.5 rounded-lg border border-border/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span className="text-foreground leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Skills & Suggested Tools */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Skills */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Required Competencies
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.required_skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-[11px] bg-background/60">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tools */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-sky-400" /> Recommended Stack & Tools
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.suggested_tools.map((tool, idx) => (
                            <Badge key={idx} variant="purple" className="text-[11px]">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Risks */}
                    {phase.potential_risks && phase.potential_risks.length > 0 && (
                      <div className="pt-2">
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1 text-xs">
                          <div className="font-bold flex items-center gap-1 text-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Potential Implementation Risks
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-[11px]">
                            {phase.potential_risks.map((risk, idx) => (
                              <li key={idx}>{risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
