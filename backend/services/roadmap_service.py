from typing import Dict, Any, List
from logging_config import logger

def generate_implementation_roadmap(
    project_title: str,
    raw_idea: str,
    domain: str = "General CS/AI",
    tech_stack: Dict[str, List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Generates a production-ready, multi-phase AI implementation roadmap
    tailored to project title, raw idea, domain, and recommended tech stack.
    """
    logger.info(f"Generating implementation roadmap for: '{project_title}' ({domain})")
    
    fe = ", ".join(tech_stack.get("frontend", ["React", "TypeScript", "TailwindCSS"])) if tech_stack else "React, TypeScript, TailwindCSS"
    be = ", ".join(tech_stack.get("backend", ["FastAPI", "Python", "LangGraph"])) if tech_stack else "FastAPI, Python, LangGraph, Gemini API"
    db = ", ".join(tech_stack.get("database", ["PostgreSQL", "FAISS Vector DB"])) if tech_stack else "PostgreSQL, FAISS Vector DB"
    cloud = ", ".join(tech_stack.get("cloud", ["Docker", "Google Cloud Run"])) if tech_stack else "Docker, Google Cloud Run, Vercel"

    roadmap_phases = [
        {
            "phase_id": "phase-1",
            "phase_number": 1,
            "title": "Phase 1 — Research & Planning",
            "estimated_duration": "2 - 3 Weeks",
            "status": "pending",
            "deliverables": [
                f"Domain requirement analysis for {project_title}.",
                "Comprehensive literature survey from Semantic Scholar & arXiv.",
                "Research Gap Matrix & Competitive Benchmark report.",
                "Finalized project scope & user persona definitions."
            ],
            "required_skills": [
                "Domain Knowledge & Literature Synthesis",
                "Technical Feasibility Evaluation",
                "User Workflow Mapping"
            ],
            "suggested_tools": [
                "Semantic Scholar API",
                "ArXiv API",
                "Notion / Google Docs",
                "Miro / Figma Wireframes"
            ],
            "potential_risks": [
                "Ambiguous project scope or scope creep.",
                "Inadequate peer-reviewed benchmark datasets."
            ]
        },
        {
            "phase_id": "phase-2",
            "phase_number": 2,
            "title": "Phase 2 — System Design & Architecture",
            "estimated_duration": "2 Weeks",
            "status": "pending",
            "deliverables": [
                f"High-level system architecture specification ({be}).",
                f"Database ERD & Vector Schema design ({db}).",
                f"RESTful API route contracts & OpenAPI specs.",
                f"UI/UX wireframes & component hierarchy ({fe})."
            ],
            "required_skills": [
                "System Architecture & API Design",
                "Database Modeling (PostgreSQL + FAISS)",
                "State Graph Design (LangGraph)"
            ],
            "suggested_tools": [
                "Mermaid.js",
                "Postman / Swagger",
                "SQLAlchemy ORM",
                "Figma"
            ],
            "potential_risks": [
                "State graph cyclic deadlock or reasoning drift.",
                "Vector embedding dimension incompatibility."
            ]
        },
        {
            "phase_id": "phase-3",
            "phase_number": 3,
            "title": "Phase 3 — Core Development",
            "estimated_duration": "4 - 5 Weeks",
            "status": "pending",
            "deliverables": [
                "FastAPI backend microservice with SSE streaming pipelines.",
                "LangGraph Multi-Agent execution nodes (Research, Architecture, Scoring).",
                "React + TypeScript modern dashboard interface with dark mode.",
                "Integrated embedded PDF paper workspace & GitHub Explorer."
            ],
            "required_skills": [
                "Async Python (FastAPI / asyncio)",
                "React & TypeScript Frontend Development",
                "LangChain / LangGraph Agent Orchestration"
            ],
            "suggested_tools": [
                "FastAPI",
                "React + Vite",
                "TailwindCSS",
                "Pytest & Vitest"
            ],
            "potential_risks": [
                "External API rate limits (GitHub & Semantic Scholar).",
                "CORS / X-Frame-Options iframe embedding restrictions on third-party PDFs."
            ]
        },
        {
            "phase_id": "phase-4",
            "phase_number": 4,
            "title": "Phase 4 — Testing & Quality Assurance",
            "estimated_duration": "1 - 2 Weeks",
            "status": "pending",
            "deliverables": [
                "End-to-end integration test suite.",
                "FAISS vector store query retrieval accuracy benchmarks.",
                "Cross-browser responsive UI testing.",
                "Security & API authentication audit."
            ],
            "required_skills": [
                "Unit & Integration Testing",
                "Performance Benchmarking",
                "Security & Vulnerability Assessment"
            ],
            "suggested_tools": [
                "Pytest-asyncio",
                "Playwright / Cypress",
                "Lighthouse UI Auditor"
            ],
            "potential_risks": [
                "High latency during live LLM multi-step agent graphs.",
                "Unhandled edge cases in raw user prompt parsing."
            ]
        },
        {
            "phase_id": "phase-5",
            "phase_number": 5,
            "title": "Phase 5 — Deployment & Monitoring",
            "estimated_duration": "1 Week",
            "status": "pending",
            "deliverables": [
                f"Containerized Docker setup ({cloud}).",
                "Continuous Integration & CD GitHub Actions workflow.",
                "Live health check API monitoring & structured logging.",
                "Comprehensive developer & user documentation."
            ],
            "required_skills": [
                "DevOps & Container Orchestration (Docker)",
                "Cloud Deployment (GCP / AWS / Vercel)",
                "Monitoring & Logging Configuration"
            ],
            "suggested_tools": [
                "Docker / Docker Compose",
                "GitHub Actions CI/CD",
                "Prometheus / Grafana",
                "Sentry Error Logging"
            ],
            "potential_risks": [
                "Deployment environment variable misconfigurations.",
                "Cold-start latency on serverless cloud containers."
            ]
        }
    ]

    return roadmap_phases
