import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project, AgentStepProgress } from '../types';
import { generateProjectData, generateSmartMockData } from '../utils/geminiService';

// ─── localStorage keys ────────────────────────────────────────────────────────
const LS_PROJECTS_KEY = 'innovation_ai_projects';

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-seed-1',
    userId: 'usr-default',
    title: 'Autonomous Medical Diagnostic Assistant',
    rawIdea: 'AI-driven diagnostic co-pilot using computer vision and electronic health records to detect clinical anomalies.',
    domain: 'Healthcare',
    targetAudience: 'Clinicians & Radiologists',
    status: 'completed',
    innovationScore: 89.4,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    ...generateSmartMockData('Autonomous Medical Diagnostic Assistant', 'Healthcare', 'AI-driven diagnostic co-pilot')
  },
  {
    id: 'proj-seed-2',
    userId: 'usr-default',
    title: 'Decentralized Vector Search Index',
    rawIdea: 'Privacy-preserving decentralized vector indexing protocol for encrypted semantic retrieval on blockchain networks.',
    domain: 'Blockchain',
    targetAudience: 'Web3 Developers & Researchers',
    status: 'completed',
    innovationScore: 92.1,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    ...generateSmartMockData('Decentralized Vector Search Index', 'Blockchain', 'Privacy-preserving vector index')
  },
  {
    id: 'proj-seed-3',
    userId: 'usr-default',
    title: 'Real-Time Adaptive Robotic Vision',
    rawIdea: 'Low-latency ROS2 Humble edge framework for robotic spatial mapping and dynamic obstacle avoidance.',
    domain: 'Robotics',
    targetAudience: 'Robotics Engineers',
    status: 'completed',
    innovationScore: 86.8,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    ...generateSmartMockData('Real-Time Adaptive Robotic Vision', 'Robotics', 'Low-latency ROS2 Humble edge framework')
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadProjectsFromStorage(): Project[] {
  try {
    const raw = localStorage.getItem(LS_PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch {}
  return SEED_PROJECTS;
}

function saveProjectsToStorage(projects: Project[]) {
  try {
    localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(projects));
  } catch {}
}

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Initial agent steps ──────────────────────────────────────────────────────
const initialAgentSteps: AgentStepProgress[] = [
  {
    id: 'step-1',
    name: 'Research Intelligence Agent',
    agentName: 'ResearchAgent',
    description: 'Searches academic papers (ArXiv, Semantic Scholar), summarizes findings, and detects research gaps.',
    status: 'idle',
  },
  {
    id: 'step-2',
    name: 'Innovation Generator Agent',
    agentName: 'InnovationAgent',
    description: 'Generates innovative solution variants, boosts originality, and computes novelty metrics.',
    status: 'idle',
  },
  {
    id: 'step-3',
    name: 'Architecture Builder Agent',
    agentName: 'ArchitectureAgent',
    description: 'Designs complete system architecture, tech stack, and Mermaid diagrams.',
    status: 'idle',
  },
  {
    id: 'step-4',
    name: 'Project Structure Agent',
    agentName: 'ProjectAgent',
    description: 'Generates folder tree, API OpenAPI specs, database SQL DDL, and ER diagrams.',
    status: 'idle',
  },
  {
    id: 'step-5',
    name: 'Output Synthesis Agent',
    agentName: 'OutputAgent',
    description: 'Synthesizes Research Report, Literature Survey, and Complete Project Blueprint.',
    status: 'idle',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjectsState] = useState<Project[]>(() => loadProjectsFromStorage());

  // Pick the first project as active on first load, or null
  const [activeProject, setActiveProjectState] = useState<Project | null>(() => {
    const stored = loadProjectsFromStorage();
    return stored[0] || null;
  });

  const [pipelineSteps, setPipelineSteps] = useState<AgentStepProgress[]>(initialAgentSteps);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const setProjects = useCallback((updater: (prev: Project[]) => Project[]) => {
    setProjectsState((prev) => {
      const next = updater(prev);
      saveProjectsToStorage(next);
      return next;
    });
  }, []);

  const setActiveProject = (proj: Project | null) => {
    setActiveProjectState(proj);
  };

  // ── createNewProject ───────────────────────────────────────────────────────
  const createNewProject = async (
    title: string,
    idea: string,
    domain: string,
    targetAudience?: string
  ): Promise<Project> => {
    const mockData = generateSmartMockData(title, domain, idea);
    const newProj: Project = {
      id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      userId: 'usr-default',
      title,
      rawIdea: idea,
      domain,
      targetAudience,
      status: 'draft',
      innovationScore: mockData.scores.overallScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      papers: mockData.papers,
      gaps: mockData.gaps,
      solutions: mockData.solutions,
      architecture: mockData.architecture,
      scores: mockData.scores,
      documents: [],
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectState(newProj);
    return newProj;
  };

  // ── runPipeline ────────────────────────────────────────────────────────────
  const runPipeline = async (projectId: string) => {
    const targetProj = projects.find((p) => p.id === projectId);
    if (!targetProj) return;

    setIsPipelineRunning(true);
    setPipelineSteps(initialAgentSteps.map((s) => ({ ...s, status: 'idle' })));

    // Helper to mark a step in-progress then complete
    const runStep = async (
      stepIndex: number,
      delayMs: number,
      summary: string
    ) => {
      setPipelineSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === stepIndex) return { ...step, status: 'in_progress' };
          if (idx < stepIndex) return { ...step, status: 'completed' };
          return step;
        })
      );
      await new Promise((r) => setTimeout(r, delayMs));
      setPipelineSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === stepIndex)
            return { ...step, status: 'completed', outputSummary: summary };
          return step;
        })
      );
    };

    try {
      // Step 1 — Research (generates via Gemini or smart mock)
      await runStep(0, 800, 'Fetching papers from Semantic Scholar & arXiv. Identifying research gaps…');

      // Actually generate data (Gemini or smart mock) during step 1–2
      const generated = await generateProjectData(
        targetProj.title,
        targetProj.domain,
        targetProj.rawIdea
      );

      await runStep(1, 600, `Generated ${generated.solutions.length} innovative solutions. Overall Novelty Score: ${generated.scores.overallScore}/100.`);
      await runStep(2, 700, 'Synthesized domain-specific system architecture, sequence flow, and Mermaid diagrams.');
      await runStep(3, 600, 'Generated project folder tree, ER diagram, SQL DDL schema, and API documentation.');
      await runStep(4, 500, 'Compiled complete research blueprint and academic literature survey documents.');

      // Build document content
      const blueprintMd = buildBlueprintMarkdown(targetProj, generated);
      const reportMd = buildResearchReportMarkdown(targetProj, generated);

      const updatedProject: Project = {
        ...targetProj,
        status: 'completed',
        innovationScore: generated.scores.overallScore,
        updatedAt: new Date().toISOString(),
        scores: generated.scores,
        papers: generated.papers,
        gaps: generated.gaps,
        solutions: generated.solutions,
        architecture: generated.architecture,
        documents: [
          {
            id: `doc-${Date.now()}-1`,
            docType: 'complete_blueprint',
            title: 'Complete Project Blueprint',
            markdownContent: blueprintMd,
            version: 1,
            createdAt: new Date().toISOString(),
          },
          {
            id: `doc-${Date.now()}-2`,
            docType: 'research_report',
            title: 'Academic Research Report & Literature Survey',
            markdownContent: reportMd,
            version: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );
      if (activeProject?.id === projectId) {
        setActiveProjectState(updatedProject);
      }
    } finally {
      setIsPipelineRunning(false);
    }
  };

  // ── deleteProject ──────────────────────────────────────────────────────────
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Clear per-project chat history
    try {
      localStorage.removeItem(`chat_${id}`);
    } catch {}
    setProjectsState((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (activeProject?.id === id) {
        setActiveProjectState(remaining[0] || null);
      }
      return remaining;
    });
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
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};

// ─── Markdown generators ──────────────────────────────────────────────────────
function buildBlueprintMarkdown(proj: Project, data: ReturnType<typeof Object.assign>): string {
  const { papers, gaps, solutions, architecture, scores } = data;
  return `# ${proj.title} — Complete Project Blueprint

## Executive Summary
**${proj.title}** is an innovative ${proj.domain} solution designed to address: _${proj.rawIdea}_

**Innovation Score: ${scores.overallScore}/100** | Originality: ${scores.originality} | Impact: ${scores.impact} | Novelty: ${scores.novelty}

---

## 1. Problem Statement
**Domain**: ${proj.domain}
**Target Audience**: ${proj.targetAudience || 'Researchers & Developers'}

${proj.rawIdea}

---

## 2. Research Gaps Identified

${gaps.map((g: any, i: number) => `### Gap ${i + 1}: ${g.category.toUpperCase()} Gap
**Problem**: ${g.description}
**Our Solution**: ${g.proposedSolution}
**Impact Level**: ${g.impactLevel} | **Novelty Score**: ${g.noveltyRating}/100`).join('\n\n')}

---

## 3. Innovative Solutions Proposed

${solutions.map((s: any, i: number) => `### Solution ${i + 1}: ${s.featureName}
${s.description}
- **Originality**: ${s.originalityBoost}
- **Feasibility**: ${s.feasibilityScore}/100 | **Impact**: ${s.impactScore}/100 | **Novelty**: ${s.noveltyScore}/100
- **Technical Risk**: ${s.technicalRisk}`).join('\n\n')}

---

## 4. Recommended Technology Stack

- **Frontend**: ${architecture.frontendStack.join(', ')}
- **Backend**: ${architecture.backendStack.join(', ')}
- **Database & Storage**: ${architecture.databaseStack.join(', ')}
- **Deployment**: ${architecture.cloudDeployment.join(', ')}

---

## 5. Key Research References

${papers.map((p: any, i: number) => `${i + 1}. **${p.title}** (${p.authors.join(', ')}, ${p.publishedYear}) — [${p.source}](${p.url}) | Citations: ${p.citationCount}`).join('\n')}

---
_Generated by Innovation_and_new AI — ${new Date().toLocaleDateString()}_`;
}

function buildResearchReportMarkdown(proj: Project, data: ReturnType<typeof Object.assign>): string {
  const { papers, gaps } = data;
  return `# Academic Literature Survey & Research Report

## Project: ${proj.title}
**Domain**: ${proj.domain} | **Generated**: ${new Date().toLocaleDateString()}

---

## Abstract
This report presents a systematic literature analysis for the project "${proj.title}" within ${proj.domain}. We surveyed ${papers.length} peer-reviewed works and identified ${gaps.length} critical research gaps that the proposed solution uniquely addresses.

---

## Reviewed Literature

${papers.map((p: any, i: number) => `### ${i + 1}. ${p.title}
- **Authors**: ${p.authors.join(', ')}
- **Year**: ${p.publishedYear} | **Citations**: ${p.citationCount}
- **Source**: [${p.url}](${p.url})
- **Abstract**: ${p.abstract}
- **Key Findings**: ${p.keyFindings.map((f: string) => `\n  - ${f}`).join('')}`).join('\n\n')}

---

## Identified Research Gaps

${gaps.map((g: any, i: number) => `### Gap ${i + 1}: ${g.category} (Novelty: ${g.noveltyRating}/100)
- **Current Limitation**: ${g.description}
- **Proposed Solution**: ${g.proposedSolution}
- **Impact Level**: ${g.impactLevel}`).join('\n\n')}

---
_Powered by Innovation_and_new AI Multi-Agent Pipeline_`;
}
