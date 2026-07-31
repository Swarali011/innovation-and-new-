import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  MessageSquareCode, 
  Sparkles, 
  Layers, 
  BarChart3, 
  FileText, 
  History, 
  Settings, 
  ShieldCheck,
  Box,
  GraduationCap,
  GitBranch,
  Rocket
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'New Project', path: '/new-project', icon: PlusCircle, badge: 'Agent' },
  { name: 'Research Workspace', path: '/workspace', icon: BookOpen, badge: 'PDF' },
  { name: 'GitHub Explorer', path: '/github', icon: GitBranch, badge: 'Code' },
  { name: 'Implementation Roadmap', path: '/roadmap', icon: Rocket, badge: 'Timeline' },
  { name: 'AI Chat Assistant', path: '/chat', icon: MessageSquareCode, badge: 'RAG' },
  { name: 'Research Gap Analysis', path: '/gaps', icon: Sparkles },
  { name: 'Architecture Generator', path: '/architecture', icon: Layers },
  { name: 'Innovation Scoring', path: '/scoring', icon: BarChart3 },
  { name: 'Generated Documents', path: '/documents', icon: FileText },
  { name: 'Project History', path: '/history', icon: History },
  { name: 'User Settings', path: '/settings', icon: Settings },
  { name: 'Authentication', path: '/auth', icon: ShieldCheck },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-border/60 flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 text-white">
          <Box className="w-5 h-5 animate-float" />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <h1 className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-1.5">
            <span className="gradient-text">Innovation_and_new</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono border border-violet-500/20">AI</span>
          </h1>
          <p className="text-[10px] text-muted-foreground truncate font-medium">From Idea to Innovation in Minutes</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Navigation Pipeline</p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                )
              }
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Branding */}
      <div className="p-3 border-t border-border/60 bg-muted/20">
        <div className="rounded-lg p-2.5 bg-card/60 border border-border/50 text-[11px] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-foreground">
            <GraduationCap className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="truncate">Team: Prachi P & Swarali L</span>
          </div>
          <p className="text-[10px] text-muted-foreground truncate">Ajeenkya D.Y.Patil School of Eng.</p>
        </div>
      </div>
    </aside>
  );
};
