import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { RoadmapPhase } from '../types';
import { ImplementationRoadmapView } from '../components/roadmap/ImplementationRoadmapView';

export const RoadmapPage: React.FC = () => {
  const { activeProject } = useProject();
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://innovation-ai-backend-k2gq.onrender.com/api/v1/research/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_title: activeProject?.title || 'AI Innovation Co-Pilot System',
        raw_idea: activeProject?.rawIdea || 'Autonomous AI research workspace for idea analysis, paper discovery, and architectural blueprints.',
        domain: activeProject?.domain || 'General CS/AI'
      })
    })
      .then(res => res.json())
      .then(data => {
        setPhases(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback default roadmap phases
        setPhases([
          {
            phase_id: 'phase-1',
            phase_number: 1,
            title: 'Phase 1 — Research & Planning',
            estimated_duration: '2 - 3 Weeks',
            status: 'pending',
            deliverables: [
              'Understand target domain & requirements.',
              'Finalize core feature requirements.',
              'Study related research papers from Semantic Scholar & arXiv.',
              'Analyze similar open-source GitHub repositories.'
            ],
            required_skills: ['Domain Knowledge', 'Technical Feasibility', 'Workflow Mapping'],
            suggested_tools: ['Semantic Scholar API', 'ArXiv API', 'Figma Wireframes'],
            potential_risks: ['Ambiguous project scope or requirement drift.']
          },
          {
            phase_id: 'phase-2',
            phase_number: 2,
            title: 'Phase 2 — System Design & Architecture',
            estimated_duration: '2 Weeks',
            status: 'pending',
            deliverables: [
              'High-level backend system architecture specification.',
              'Database ERD & Vector DB Schema design.',
              'RESTful API route contracts & OpenAPI specifications.',
              'UI wireframes & component hierarchy.'
            ],
            required_skills: ['System Architecture', 'Database Design (PostgreSQL + FAISS)', 'API Contracts'],
            suggested_tools: ['Mermaid.js', 'Swagger OpenAPI', 'SQLAlchemy ORM'],
            potential_risks: ['Vector embedding dimension mismatch.']
          },
          {
            phase_id: 'phase-3',
            phase_number: 3,
            title: 'Phase 3 — Core Development',
            estimated_duration: '4 - 5 Weeks',
            status: 'pending',
            deliverables: [
              'FastAPI backend microservice with SSE streaming pipelines.',
              'LangGraph Multi-Agent execution nodes.',
              'React + TypeScript modern dashboard with dark mode.',
              'Embedded PDF research paper workspace & GitHub Explorer.'
            ],
            required_skills: ['FastAPI (Python)', 'React & TypeScript', 'LangGraph Agent Graphs'],
            suggested_tools: ['FastAPI', 'React + Vite', 'TailwindCSS'],
            potential_risks: ['External API rate limits (GitHub & Semantic Scholar).']
          },
          {
            phase_id: 'phase-4',
            phase_number: 4,
            title: 'Phase 4 — Testing & Quality Assurance',
            estimated_duration: '1 - 2 Weeks',
            status: 'pending',
            deliverables: [
              'Unit & integration test suites.',
              'FAISS vector store query benchmark.',
              'Cross-browser responsive UI validation.',
              'Security & API authentication audit.'
            ],
            required_skills: ['Integration Testing', 'Performance Benchmarking'],
            suggested_tools: ['Pytest-asyncio', 'Playwright / Vitest'],
            potential_risks: ['Latency during live LLM multi-step execution graphs.']
          },
          {
            phase_id: 'phase-5',
            phase_number: 5,
            title: 'Phase 5 — Deployment & Monitoring',
            estimated_duration: '1 Week',
            status: 'pending',
            deliverables: [
              'Containerized Docker setup.',
              'CI/CD GitHub Actions workflow.',
              'Live health check monitoring.',
              'Comprehensive user & developer documentation.'
            ],
            required_skills: ['DevOps & Containerization', 'Cloud Deployment'],
            suggested_tools: ['Docker', 'GitHub Actions', 'GCP Cloud Run'],
            potential_risks: ['Cold-start latency on serverless cloud containers.']
          }
        ]);
        setLoading(false);
      });
  }, [activeProject]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Synthesizing personalized AI Implementation Roadmap...</p>
        </div>
      ) : (
        <ImplementationRoadmapView phases={phases} projectTitle={activeProject?.title} />
      )}
    </div>
  );
};
