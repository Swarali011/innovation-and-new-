import React, { useState } from 'react';
import { Layers, Code2, Database, Cloud, Network, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const ArchitectureGeneratorPage: React.FC = () => {
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState<'system' | 'sequence' | 'erd' | 'tree'>('system');
  const arch = activeProject?.architecture;

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
            Synthesized by Architecture Builder Agent & Project Structure Agent.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-muted/40 p-1 rounded-lg border border-border/60">
          <Button
            variant={activeTab === 'system' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('system')}
            className="text-xs h-7"
          >
            System Diagram
          </Button>
          <Button
            variant={activeTab === 'sequence' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sequence')}
            className="text-xs h-7"
          >
            Sequence Flow
          </Button>
          <Button
            variant={activeTab === 'erd' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('erd')}
            className="text-xs h-7"
          >
            ER Diagram
          </Button>
          <Button
            variant={activeTab === 'tree' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tree')}
            className="text-xs h-7"
          >
            Folder Tree
          </Button>
        </div>
      </div>

      {/* Tech Stack Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-violet-400">
            <Code2 className="w-4 h-4" />
            <span>Frontend Tier</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch?.frontendStack.map((tech, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">{tech}</Badge>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
            <Network className="w-4 h-4" />
            <span>Backend Tier</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch?.backendStack.map((tech, i) => (
              <Badge key={i} variant="purple" className="text-[10px]">{tech}</Badge>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Database className="w-4 h-4" />
            <span>Database & Vectors</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch?.databaseStack.map((tech, i) => (
              <Badge key={i} variant="success" className="text-[10px]">{tech}</Badge>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
            <Cloud className="w-4 h-4" />
            <span>Cloud & Containers</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {arch?.cloudDeployment.map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-[10px]">{tech}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Diagram Viewer Code Container */}
      <Card className="glass-panel border-border/60">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold capitalize">{activeTab} Specification Code</CardTitle>
            <CardDescription className="text-xs">Generated Mermaid.js diagram code</CardDescription>
          </div>
          <Badge variant="purple" className="font-mono text-[10px]">Mermaid v10</Badge>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-border/40 shadow-inner">
            <pre>
              {activeTab === 'system' && arch?.systemMermaidCode}
              {activeTab === 'sequence' && arch?.sequenceMermaidCode}
              {activeTab === 'erd' && arch?.erMermaidCode}
              {activeTab === 'tree' && JSON.stringify(arch?.folderTreeJson, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
