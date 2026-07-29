import React, { createContext, useContext, useState } from 'react';
import { Project, AgentStepProgress } from '../types';
import { mockProject, mockPapers, mockGaps, mockSolutions, mockArchitecture, mockDocuments, mockProjectsList } from '../utils/mockData';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  pipelineSteps: AgentStepProgress[];
  isPipelineRunning: boolean;
  setActiveProject: (project: Project | null) => void;
  createNewProject: (title: string, idea: string, domain: string, targetAudience?: string) => Promise<Project>;
  runPipeline: (projectId: string) => Promise<void>;
  deleteProject: (id: string) => void;
}

const initialAgentSteps: AgentStepProgress[] = [
  {
    id: 'step-1',
    name: 'Research Intelligence Agent',
    agentName: 'ResearchAgent',
    description: 'Searches academic papers (ArXiv, Semantic Scholar), summarizes findings, and detects research gaps.',
    status: 'idle'
  },
  {
    id: 'step-2',
    name: 'Innovation Generator Agent',
    agentName: 'InnovationAgent',
    description: 'Generates innovative solution variants, boosts originality, and computes metrics.',
    status: 'idle'
  },
  {
    id: 'step-3',
    name: 'Architecture Builder Agent',
    agentName: 'ArchitectureAgent',
    description: 'Designs complete system architecture, frontend, backend, DB, and Mermaid diagrams.',
    status: 'idle'
  },
  {
    id: 'step-4',
    name: 'Project Structure Agent',
    agentName: 'ProjectAgent',
    description: 'Generates folder tree, API OpenAPI specs, database SQL DDL, and ER diagrams.',
    status: 'idle'
  },
  {
    id: 'step-5',
    name: 'Output Synthesis Agent',
    agentName: 'OutputAgent',
    description: 'Synthesizes Research Report, Literature Survey, and Complete Project Blueprint.',
    status: 'idle'
  }
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const fullMockProject: Project = {
      ...mockProject,
      papers: mockPapers,
      gaps: mockGaps,
      solutions: mockSolutions,
      architecture: mockArchitecture,
      documents: mockDocuments
    };
    return [fullMockProject, ...mockProjectsList.slice(1)];
  });

  const [activeProject, setActiveProjectState] = useState<Project | null>(projects[0] || null);
  const [pipelineSteps, setPipelineSteps] = useState<AgentStepProgress[]>(initialAgentSteps);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  const setActiveProject = (proj: Project | null) => {
    setActiveProjectState(proj);
  };

  const createNewProject = async (title: string, idea: string, domain: string, targetAudience?: string): Promise<Project> => {
    const newProj: Project = {
      id: `proj-${Date.now().toString(36)}`,
      userId: 'usr-default',
      title,
      rawIdea: idea,
      domain,
      targetAudience,
      status: 'draft',
      innovationScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      papers: [],
      gaps: [],
      solutions: [],
      documents: []
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectState(newProj);
    return newProj;
  };

  const runPipeline = async (projectId: string) => {
    setIsPipelineRunning(true);
    
    // Reset steps
    setPipelineSteps(initialAgentSteps.map(s => ({ ...s, status: 'idle' })));

    // Simulate real-time LangGraph multi-agent execution
    const runStep = async (stepIndex: number, delayMs: number, summary: string) => {
      setPipelineSteps((prev) => prev.map((step, idx) => {
        if (idx === stepIndex) return { ...step, status: 'in_progress' };
        if (idx < stepIndex) return { ...step, status: 'completed' };
        return step;
      }));

      await new Promise((r) => setTimeout(r, delayMs));

      setPipelineSteps((prev) => prev.map((step, idx) => {
        if (idx === stepIndex) return { ...step, status: 'completed', outputSummary: summary };
        return step;
      }));
    };

    try {
      await runStep(0, 1800, 'Analyzed 15 ArXiv & Semantic Scholar papers. Identified 3 core research gaps.');
      await runStep(1, 2000, 'Generated 3 innovative solution variants. Overall Novelty Score: 93.5/100.');
      await runStep(2, 2200, 'Synthesized system architecture, sequence flow, and stack specs.');
      await runStep(3, 1800, 'Generated complete folder tree, SQL DDL schema, and OpenAPI documentation.');
      await runStep(4, 1500, 'Compiled complete research blueprint and literature survey markdown documents.');

      // Update active project with generated data
      setProjects((prev) => prev.map((p) => {
        if (p.id === projectId) {
          const updated: Project = {
            ...p,
            status: 'completed',
            innovationScore: 92.5,
            updatedAt: new Date().toISOString(),
            scores: {
              originality: 94.0,
              feasibility: 88.0,
              impact: 95.0,
              novelty: 93.0,
              overallScore: 92.5
            },
            papers: mockPapers,
            gaps: mockGaps,
            solutions: mockSolutions,
            architecture: mockArchitecture,
            documents: mockDocuments
          };
          if (activeProject?.id === projectId) {
            setActiveProjectState(updated);
          }
          return updated;
        }
        return p;
      }));

    } finally {
      setIsPipelineRunning(false);
    }
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProjectState(projects.find((p) => p.id !== id) || null);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        pipelineSteps,
        isPipelineRunning,
        setActiveProject,
        createNewProject,
        runPipeline,
        deleteProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
