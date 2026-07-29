import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, PlusCircle, FolderGit2, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProjectHistoryPage: React.FC = () => {
  const { projects, setActiveProject, deleteProject } = useProject();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.domain.toLowerCase().includes(search.toLowerCase())
  );

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
            View, resume, or export all past multi-agent research runs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title or domain..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button variant="gradient" size="sm" onClick={() => navigate('/new-project')} className="text-xs">
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> New Run
          </Button>
        </div>
      </div>

      {/* Table List */}
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
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center space-x-2">
                        <FolderGit2 className="w-4 h-4 text-violet-400 shrink-0" />
                        <span className="truncate max-w-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{p.domain}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-violet-400">
                      {p.innovationScore > 0 ? `${p.innovationScore} / 100` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.status === 'completed' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveProject(p);
                          navigate('/workspace');
                        }}
                        className="text-xs h-7"
                      >
                        Open <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(p.id)}
                        className="w-7 h-7 text-destructive hover:bg-destructive/10"
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
    </div>
  );
};
