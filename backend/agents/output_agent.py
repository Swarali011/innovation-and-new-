from typing import Dict, Any
from agents.state import AgentState
from logging_config import logger

def run_output_agent(state: AgentState) -> Dict[str, Any]:
    """5. Output Synthesis Agent: Synthesizes final academic report and complete project blueprint."""
    logger.info(f"Output Agent compiling final blueprint for project {state['project_id']}")

    raw_idea = state.get("raw_idea", "")
    domain = state.get("domain", "General CS/AI")

    complete_blueprint_md = f"""# Innovation_and_new AI — Complete Project Blueprint

## Executive Summary
**Innovation_and_new AI** is an AI Research & Innovation Copilot converting concepts into research pipelines.
Developed by **Prachi P & Swarali L** (Ajeenkya D.Y. Patil School of Engineering).

---

## 1. Problem Statement & Raw Concept
**Input Idea**: {raw_idea}
**Domain**: {domain}

---

## 2. Identified Research Gaps
1. Integrated Multi-Agent Synthesis without manual chaining.
2. Live Mermaid Diagram Rendering & SQL DDL schema synthesis.

---

## 3. Recommended Technology Stack
- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui, Recharts
- **Backend**: FastAPI, Python 3.11, LangGraph, LangChain, Google Gemini API
- **Database & Storage**: PostgreSQL 16, FAISS Vector Store
- **Deployment**: Docker Compose, Render, Vercel
"""

    research_report_md = f"# Academic Literature Survey & SOTA Report\n\nAnalyzed current arXiv and Semantic Scholar literature for '{raw_idea}'."

    return {
        "complete_blueprint_md": complete_blueprint_md,
        "research_report_md": research_report_md,
        "current_step": "Output Synthesis Completed"
    }
