import React, { useState } from 'react';
import { Layers, Code2, Database, Cloud, Network, Copy, Check, AlertCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { generateSmartMockData } from '../utils/geminiService';

export const ArchitectureGeneratorPage: React.FC = () => {
  const { activeProject, runPipeline, isPipelineRunning } = useProject();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'system' | 'sequence' | 'erd' | 'tree'>('system');
  const [copied, setCopied] = useState(false);

  // ── No project ─────────────────────────────────────────────────────────────
  if (!activeProject) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Layers className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground text-sm">No active project selected.</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/new-project')} className="text-xs">
            Create a Project
          </Button>
        </div>
      </div>
    );
  }

  // Resolve architecture specs, dynamically generating if not already present
  const arch = activeProject.architecture || generateSmartMockData(
    activeProject.title,
    activeProject.domain,
    activeProject.rawIdea
  ).architecture;

  const handleCopy = () => {
    const content =
      activeTab === 'system'
        ? arch?.systemMermaidCode
        : activeTab === 'sequence'
        ? arch?.sequenceMermaidCode
        : activeTab === 'erd'
        ? arch?.erMermaidCode
        : JSON.stringify(arch?.folderTreeJson, null, 2);
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Full architecture view ─────────────────────────────────────────────────
  const tabContent =
    activeTab === 'system'
      ? arch.systemMermaidCode
      : activeTab === 'sequence'
      ? arch.sequenceMermaidCode
      : activeTab === 'erd'
      ? arch.erMermaidCode
      : JSON.stringify(arch.folderTreeJson, null, 2);

  const tabLabel =
    activeTab === 'system'
      ? 'System Architecture Diagram (Mermaid)'
      : activeTab === 'sequence'
      ? 'Sequence Flow Diagram (Mermaid)'
      : activeTab === 'erd'
      ? 'Entity-Relationship Diagram (Mermaid)'
      : 'Project Folder Tree (JSON)';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Architecture Generator & Tech Stack Specs</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Synthesized for <span className="text-violet-400 font-semibold">"{activeProject.title}"</span> by
            the Architecture Builder Agent.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 bg-muted/40 p-1 rounded-lg border border-border/60">
          {(['system', 'sequence', 'erd', 'tree'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="text-xs h-7 capitalize"
            >
              {tab === 'system' ? 'System' : tab === 'sequence' ? 'Sequence' : tab === 'erd' ? 'ER Diagram' : 'Folder Tree'}
            </Button>
          ))}
        </div>
      </div>

      {/* Tech Stack Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-violet-400">
            <Code2 className="w-4 h-4" />
            <span>Frontend Tier</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch.frontendStack.map((tech, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
            <Network className="w-4 h-4" />
            <span>Backend Tier</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch.backendStack.map((tech, i) => (
              <Badge key={i} variant="purple" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Database className="w-4 h-4" />
            <span>Database & Vectors</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch.databaseStack.map((tech, i) => (
              <Badge key={i} variant="success" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
            <Cloud className="w-4 h-4" />
            <span>Cloud & Containers</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch.cloudDeployment.map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Diagram Code Block */}
      <Card className="glass-panel border-border/60">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">{tabLabel}</CardTitle>
            <CardDescription className="text-xs">
              {activeTab === 'tree' ? 'JSON folder structure for implementation' : 'Copy and paste into mermaid.live to render the diagram'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="font-mono text-[10px]">
              {activeTab === 'tree' ? 'JSON' : 'Mermaid v10'}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs h-7 gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-border/40 shadow-inner min-h-[200px]">
            <pre className="whitespace-pre-wrap break-words">{tabContent || '— No content —'}</pre>
          </div>
          {activeTab !== 'tree' && (
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              🔗 Render at{' '}
              <a
                href="https://mermaid.live"
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:underline"
              >
                mermaid.live
              </a>{' '}
              or use the Mermaid VS Code extension
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
