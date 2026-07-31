import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { ResearchWorkspacePage } from './pages/ResearchWorkspacePage';
import { GitHubExplorerPage } from './pages/GitHubExplorerPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AIChatAssistantPage } from './pages/AIChatAssistantPage';
import { ResearchGapPage } from './pages/ResearchGapPage';
import { ArchitectureGeneratorPage } from './pages/ArchitectureGeneratorPage';
import { InnovationScoringPage } from './pages/InnovationScoringPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ProjectHistoryPage } from './pages/ProjectHistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/new-project" element={<NewProjectPage />} />
        <Route path="/workspace" element={<ResearchWorkspacePage />} />
        <Route path="/github" element={<GitHubExplorerPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/chat" element={<AIChatAssistantPage />} />
        <Route path="/gaps" element={<ResearchGapPage />} />
        <Route path="/architecture" element={<ArchitectureGeneratorPage />} />
        <Route path="/scoring" element={<InnovationScoringPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/history" element={<ProjectHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};
