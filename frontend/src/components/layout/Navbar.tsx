import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, PlusCircle, Sparkles, FolderGit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { projects, activeProject, setActiveProject } = useProject();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/60 bg-card/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Active Project Switcher */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60">
          <FolderGit2 className="w-4 h-4 text-violet-400" />
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const proj = projects.find((p) => p.id === e.target.value);
              if (proj) setActiveProject(proj);
            }}
            className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer max-w-[200px] truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-card text-foreground">
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {activeProject && (
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">Domain:</span>
            <span className="font-medium text-foreground px-2 py-0.5 rounded bg-muted/60 text-[11px]">
              {activeProject.domain}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          variant="gradient"
          size="sm"
          onClick={() => navigate('/new-project')}
          className="flex items-center space-x-1.5 shadow-md"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Innovation Run</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="w-9 h-9"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </Button>

        {/* User Profile avatar */}
        <div 
          onClick={() => navigate('/settings')} 
          className="flex items-center space-x-2 pl-2 border-l border-border/60 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={user?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-violet-500/40 object-cover"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground">{user?.displayName}</span>
            <span className="text-[10px] text-muted-foreground font-mono">Team Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
