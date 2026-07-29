import { Project, ResearchPaper, ResearchGap, InnovationSolution, InnovationScores, ArchitectureSpec, GeneratedDocument, ChatMessage } from '../types';

export const mockProject: Project = {
  id: 'proj-88a1b2c3',
  userId: 'user-1',
  title: 'AI Research & Innovation Copilot',
  rawIdea: 'An autonomous multi-agent platform that converts a simple project idea into a full academic research paper, literature survey, innovation gap matrix, system architecture diagrams, database schemas, and complete code blueprints in minutes.',
  domain: 'Artificial Intelligence & Software Engineering',
  targetAudience: 'Researchers, Computer Science Students, Product Managers, R&D Teams',
  status: 'completed',
  innovationScore: 92.5,
  createdAt: '2026-07-28T10:15:00Z',
  updatedAt: '2026-07-28T10:18:30Z',
  scores: {
    originality: 94.0,
    feasibility: 88.0,
    impact: 95.0,
    novelty: 93.0,
    overallScore: 92.5,
  },
};

export const mockPapers: ResearchPaper[] = [
  {
    id: 'paper-1',
    title: 'LangGraph: Multi-Agent Workflows for Structured LLM Orchestration',
    authors: ['Harrison Chase', 'Bagatur Askaryan', 'Lance Martin'],
    publishedYear: 2024,
    abstract: 'We present LangGraph, a cyclical graph orchestration system for LLM applications. Unlike linear chains, LangGraph allows stateful multi-agent systems with branching, looping, and human-in-the-loop control.',
    url: 'https://arxiv.org/abs/2402.12345',
    source: 'arxiv',
    relevanceScore: 0.96,
    keyFindings: [
      'Cyclic graph execution resolves state loss in complex multi-step reasoning.',
      'Agent state persistence enables effortless pause/resume human approval workflows.'
    ]
  },
  {
    id: 'paper-2',
    title: 'Autonomous AI Co-Scientists for Scientific Discovery',
    authors: ['Prachi P', 'Swarali L', 'DY Patil AI Lab'],
    publishedYear: 2025,
    abstract: 'This paper proposes a framework for autonomous AI co-scientists that perform real-time arXiv paper retrieval, gap hypothesis synthesis, and system architecture generation.',
    url: 'https://semanticscholar.org/paper/67890',
    source: 'semantic_scholar',
    relevanceScore: 0.94,
    keyFindings: [
      'Multi-agent gap detection outperforms single LLM prompts by 42% in novelty.',
      'Vector indexing of arXiv metadata enables accurate literature surveys.'
    ]
  },
  {
    id: 'paper-3',
    title: 'Retrieval-Augmented Blueprint Synthesis for Enterprise Software',
    authors: ['Elena Rostova', 'Michael Chen', 'Marcus Vance'],
    publishedYear: 2024,
    abstract: 'Exploring how high-dimensional vector search combined with strict schema enforcement generates deployable software architecture blueprints.',
    url: 'https://arxiv.org/abs/2405.09876',
    source: 'arxiv',
    relevanceScore: 0.89,
    keyFindings: [
      'Mermaid.js dynamic generation provides immediate architectural validation.',
      'SQL DDL synthesis reduces project setup time from weeks to minutes.'
    ]
  }
];

export const mockGaps: ResearchGap[] = [
  {
    id: 'gap-1',
    category: 'technical',
    description: 'Current LLM code generators produce isolated code snippets without unified multi-tier architectural blueprints or executable DB schemas.',
    proposedSolution: 'Integrate an Architecture Builder Agent that validates Mermaid sequence & ER diagrams before synthesizing SQL DDL & API contracts.',
    impactLevel: 'High',
    noveltyRating: 95
  },
  {
    id: 'gap-2',
    category: 'methodological',
    description: 'Existing innovation brainstorming tools rely on unstructured user prompts without academic gap verification.',
    proposedSolution: 'Automate arXiv + Semantic Scholar vector retrieval prior to prompt generation, grounding recommendations in current literature.',
    impactLevel: 'High',
    noveltyRating: 91
  },
  {
    id: 'gap-3',
    category: 'domain_application',
    description: 'Lack of real-time progress visualization for multi-agent LLM graphs during long-running reasoning pipelines.',
    proposedSolution: 'Implement Server-Sent Events (SSE) state streaming directly into a Framer Motion agent node dashboard.',
    impactLevel: 'Medium',
    noveltyRating: 88
  }
];

export const mockSolutions: InnovationSolution[] = [
  {
    id: 'sol-1',
    featureName: 'Autonomous 5-Agent LangGraph Pipeline',
    description: 'Specialized sequential and parallel AI agents operating on a shared AgentState to refine raw ideas into peer-review ready reports.',
    originalityBoost: 'Combines academic search, gap matrix calculation, and system design in one unified state graph.',
    feasibilityScore: 92,
    impactScore: 96,
    noveltyScore: 95,
    technicalRisk: 'Low'
  },
  {
    id: 'sol-2',
    featureName: 'Interactive Mermaid Architecture & ER Visualizer',
    description: 'Generates live editable system architecture, sequence flow, and database entity-relationship diagrams renderable directly in browser.',
    originalityBoost: 'Bi-directional prompt-to-diagram dynamic editing with instant architectural consistency checks.',
    feasibilityScore: 90,
    impactScore: 94,
    noveltyScore: 91,
    technicalRisk: 'Low'
  },
  {
    id: 'sol-3',
    featureName: 'FAISS-Powered Context-Aware RAG Copilot',
    description: 'In-workspace chat assistant trained on the project documents and retrieved papers with instant reference citations.',
    originalityBoost: 'Per-project localized vector index for precise answer grounding.',
    feasibilityScore: 95,
    impactScore: 90,
    noveltyScore: 89,
    technicalRisk: 'Low'
  }
];

export const mockArchitecture: ArchitectureSpec = {
  frontendStack: ['React 18', 'TypeScript', 'TailwindCSS', 'shadcn/ui', 'React Router', 'Framer Motion', 'Recharts'],
  backendStack: ['FastAPI', 'Python 3.11', 'LangGraph', 'LangChain', 'Google Gemini API (Gemini 1.5 Pro)'],
  databaseStack: ['PostgreSQL 16 (Relational DB)', 'FAISS (Vector Index for RAG embeddings)', 'SQLAlchemy Async'],
  cloudDeployment: ['Docker & Docker Compose', 'Render (FastAPI API)', 'Vercel (Vite React Client)'],
  systemMermaidCode: `graph TD
    User([User Client]) --> Auth[Firebase Authentication]
    Auth --> Frontend[React 18 SPA]
    Frontend --> REST[FastAPI Gateway]
    
    subgraph Multi-Agent Orchestrator
        REST --> LG[LangGraph Engine]
        LG --> A1[1. Research Intelligence Agent]
        LG --> A2[2. Innovation Generator Agent]
        LG --> A3[3. Architecture Builder Agent]
        LG --> A4[4. Project Structure Agent]
        LG --> A5[5. Output Synthesis Agent]
    end
    
    A1 --> PaperAPI[ArXiv & Semantic Scholar]
    A1 --> Gemini[Google Gemini 1.5 Pro]
    LG --> PG[(PostgreSQL DB)]
    LG --> FAISS[(FAISS Vector Store)]`,
  sequenceMermaidCode: `sequenceDiagram
    autonumber
    actor User
    participant FE as React Frontend
    participant API as FastAPI Gateway
    participant LG as LangGraph StateGraph
    participant DB as PostgreSQL & FAISS

    User->>FE: Enter Project Idea
    FE->>API: POST /api/v1/pipeline/{id}/run
    API->>LG: Invoke StateGraph(idea)
    LG->>DB: Store initial state
    
    loop Agent Execution Loop
        LG->>LG: ResearchAgent -> InnovationAgent -> ArchAgent -> StructureAgent -> OutputAgent
        LG-->>FE: SSE Stream Progress Updates
    end
    
    LG->>DB: Persist final blueprint & vectors
    API-->>FE: Pipeline Complete Signal
    FE-->>User: Display Research Workspace & Blueprint`,
  erMermaidCode: `erDiagram
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ RESEARCH_PAPERS : contains
    PROJECTS ||--o{ RESEARCH_GAPS : detects
    PROJECTS ||--o{ INNOVATION_SOLUTIONS : proposes
    PROJECTS ||--|| PROJECT_ARCHITECTURES : defines
    PROJECTS ||--o{ GENERATED_DOCUMENTS : outputs
    PROJECTS ||--o{ CHAT_MESSAGES : logs`,
  folderTreeJson: {
    "innovation-and-new-ai": {
      "backend": {
        "main.py": "FastAPI App Entry",
        "agents": ["research_agent.py", "innovation_agent.py", "architecture_agent.py", "project_agent.py", "output_agent.py"],
        "db": ["models.py", "database.py", "vector_store.py"]
      },
      "frontend": {
        "src": ["pages/", "components/", "services/", "context/"]
      }
    }
  }
};

export const mockDocuments: GeneratedDocument[] = [
  {
    id: 'doc-1',
    docType: 'complete_blueprint',
    title: 'Complete Innovation & Project Blueprint',
    version: 1,
    createdAt: '2026-07-28T10:18:30Z',
    markdownContent: `# Innovation_and_new AI — Complete Project Blueprint

## Executive Summary
**Innovation_and_new AI** is a state-of-the-art AI Research & Innovation Copilot designed to convert early-stage concepts into fully validated academic and engineering pipelines. Developed by **Prachi P & Swarali L** (Ajeenkya D.Y. Patil School of Engineering).

---

## 1. Problem Statement
Researchers, developers, and students lose hundreds of hours manually surveying literature, discovering technical research gaps, designing scalable system architectures, and compiling initial project blueprints. Existing LLM chatbots produce unstructured text lacking verified research references or deployable architectural code.

---

## 2. Identified Research Gaps
1. **Lack of Integrated Multi-Agent Synthesis**: Standard LLMs operate in isolated single-turn chats without iterative agentic state management.
2. **Missing Architectural Diagrams**: AI text generators do not automatically produce compile-checked Mermaid system, sequence, and ER diagrams.
3. **Absence of Quantitative Novelty Metrics**: Innovation assessment remains subjective without normalized scoring metrics for Feasibility, Impact, and Novelty.

---

## 3. System Architecture & Tech Stack
- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui, Recharts, Framer Motion
- **Backend**: FastAPI, Python 3.11, LangGraph Multi-Agent Framework, LangChain, Google Gemini API
- **Storage**: PostgreSQL 16, FAISS Vector Database for RAG embeddings
- **Deployment**: Docker Compose, Render (API), Vercel (Client)

---

## 4. API Specification
- \`POST /api/v1/projects\` — Initialize new research project
- \`POST /api/v1/pipeline/{id}/run\` — Trigger 5-agent LangGraph workflow
- \`GET /api/v1/pipeline/{id}/stream\` — SSE real-time streaming progress
- \`POST /api/v1/chat/{id}/message\` — RAG context-aware copilot query

---

## 5. Database ER Diagram
\`\`\`sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    raw_idea TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    innovation_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`\`
`
  },
  {
    id: 'doc-2',
    docType: 'research_report',
    title: 'Academic Research Report & Literature Survey',
    version: 1,
    createdAt: '2026-07-28T10:17:00Z',
    markdownContent: `# Comprehensive Academic Literature Survey

### Abstract
This literature survey analyzes modern multi-agent systems and retrieval-augmented generation (RAG) paradigms for automated software architecture synthesis.

### Reviewed Literature
1. **LangGraph: Multi-Agent Workflows for Structured LLM Orchestration** (Chase et al., 2024)
2. **Autonomous AI Co-Scientists for Scientific Discovery** (Prachi & Swarali, 2025)
3. **Retrieval-Augmented Blueprint Synthesis** (Rostova et al., 2024)

### Methodological Insights
Graph-based state machine execution guarantees deterministic execution paths across independent agent roles, eliminating agent hallucination loops.
`
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    message: 'Hello! I am your **Innovation_and_new AI Copilot**. I have indexed all 3 research papers and your project blueprint. How can I assist your research today?',
    timestamp: '10:19 AM'
  },
  {
    id: 'msg-2',
    sender: 'user',
    message: 'How does our LangGraph agent architecture handle failure or agent retries during paper search?',
    timestamp: '10:20 AM'
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    message: 'Great question! In our **LangGraph StateGraph**, each agent node (e.g. `ResearchIntelligenceAgent`) updates the shared `AgentState`. If an API call fails, the node catches the error, sets `error: Optional[str]`, and routes to a fallback node or retries with exponential backoff before proceeding to the `InnovationGeneratorAgent`.',
    contextChunks: [
      'LangGraph StateGraph persistent state',
      'ResearchAgent error handling & retry loop'
    ],
    timestamp: '10:20 AM'
  }
];

export const mockProjectsList: Project[] = [
  mockProject,
  {
    id: 'proj-77b2',
    userId: 'user-1',
    title: 'Autonomous Drone Navigation using Deep RL',
    rawIdea: 'Deep reinforcement learning for real-time obstacle avoidance in GPS-denied environments.',
    domain: 'Robotics & Computer Vision',
    status: 'completed',
    innovationScore: 89.0,
    createdAt: '2026-07-25T14:30:00Z',
    updatedAt: '2026-07-25T14:34:00Z'
  },
  {
    id: 'proj-66c3',
    userId: 'user-1',
    title: 'Decentralized Identity Verification on Polygon',
    rawIdea: 'Zero-knowledge proof based digital credentials for university degree verification.',
    domain: 'Blockchain & Cryptography',
    status: 'completed',
    innovationScore: 91.2,
    createdAt: '2026-07-20T09:10:00Z',
    updatedAt: '2026-07-20T09:14:00Z'
  }
];
