import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  PlusCircle,
  FolderGit2,
  ArrowRight,
  Trash2,
  Play,
  Clock,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProjectHistoryPage: React.FC = () => {
  const { projects, setActiveProject, deleteProject, runPipeline, isPipelineRunning } = useProject();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase()) ||
      p.rawIdea?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (p: (typeof projects)[0]) => {
    setActiveProject(p);
    navigate('/workspace');
  };

  const handleRunPipeline = async (p: (typeof projects)[0]) => {
    setActiveProject(p);
    navigate('/dashboard');
    // Small delay to let navigation settle before running
    setTimeout(() => runPipeline(p.id), 300);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <History className="w-6 h-6 text-violet-400" />
            <span>Innovation Project History</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''} saved — persisted across sessions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, domain, or idea..."
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => navigate('/new-project')}
            className="text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> New Project
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <Card className="glass-panel">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <History className="w-10 h-10 text-muted-foreground/40" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">No Projects Yet</p>
              <p className="text-xs text-muted-foreground">
                Create your first research project and run the AI pipeline to see it here.
              </p>
            </div>
            <Button variant="gradient" size="sm" onClick={() => navigate('/new-project')} className="text-xs">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="glass-panel">
          <CardContent className="flex items-center justify-center py-10">
            <p className="text-sm text-muted-foreground">No projects match your search.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-panel">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-semibold bg-muted/20">
                    <th className="py-3 px-4">Project Title</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Innovation Score</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      {/* Title */}
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        <div className="flex items-center space-x-2">
                          <FolderGit2 className="w-4 h-4 text-violet-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="truncate max-w-[200px]">{p.title}</p>
                            <p className="text-[10px] text-muted-foreground font-normal truncate max-w-[200px] font-mono">
                              {p.rawIdea?.slice(0, 60)}…
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {p.domain}
                        </Badge>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 font-mono font-bold text-violet-400">
                        {p.innovationScore > 0 ? (
                          <span>{p.innovationScore.toFixed(1)} / 100</span>
                        ) : (
                          <span className="text-muted-foreground font-normal">Not scored</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            p.status === 'completed'
                              ? 'success'
                              : p.status === 'processing'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {p.status === 'processing' && (
                            <Clock className="w-2.5 h-2.5 mr-1 animate-pulse" />
                          )}
                          {p.status}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* Open workspace */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpen(p)}
                          className="text-xs h-7"
                        >
                          Open <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>

                        {/* Re-run pipeline (for draft/failed projects) */}
                        {p.status !== 'processing' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRunPipeline(p)}
                            disabled={isPipelineRunning}
                            className="text-xs h-7 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                            title="Run AI Pipeline"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProject(p.id)}
                          className="w-7 h-7 text-destructive hover:bg-destructive/10"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats bar */}
      {projects.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Total Projects', value: projects.length },
            {
              label: 'Completed',
              value: projects.filter((p) => p.status === 'completed').length,
            },
            {
              label: 'Avg. Score',
              value:
                projects.filter((p) => p.innovationScore > 0).length > 0
                  ? (
                      projects
                        .filter((p) => p.innovationScore > 0)
                        .reduce((s, p) => s + p.innovationScore, 0) /
                      projects.filter((p) => p.innovationScore > 0).length
                    ).toFixed(1)
                  : '—',
            },
          ].map((stat) => (
            <Card key={stat.label} className="glass-panel p-4">
              <p className="text-2xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
