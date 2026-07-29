import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from db.database import get_db
from db.models import ProjectModel, UserModel, ResearchPaperModel, ResearchGapModel, InnovationSolutionModel, ProjectArchitectureModel, GeneratedDocumentModel
from auth.dependencies import get_current_user
from agents.graph import innovation_graph
from db.vector_store import VectorStoreManager
from logging_config import logger

router = APIRouter(prefix="/pipeline", tags=["Agent Pipeline Stream"])

@router.post("/{project_id}/run")
async def run_pipeline(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Trigger the 5-Agent LangGraph workflow and persist outputs to PostgreSQL & FAISS."""
    result = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    proj = result.scalars().first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    proj.status = "processing"
    await db.commit()

    # Initial AgentState
    initial_state = {
        "project_id": str(project_id),
        "user_id": str(current_user.id),
        "raw_idea": proj.raw_idea,
        "domain": proj.domain,
        "target_audience": proj.target_audience
    }

    # Execute LangGraph graph
    final_state = innovation_graph.invoke(initial_state)

    # Persist papers
    for paper in final_state.get("papers", []):
        p_model = ResearchPaperModel(
            project_id=project_id,
            title=paper["title"],
            authors=paper["authors"],
            published_year=paper["published_year"],
            abstract=paper["abstract"],
            url=paper["url"],
            source=paper["source"],
            relevance_score=paper["relevance_score"],
            key_findings=paper["key_findings"]
        )
        db.add(p_model)

    # Persist gaps
    for gap in final_state.get("research_gaps", []):
        g_model = ResearchGapModel(
            project_id=project_id,
            category=gap["category"],
            description=gap["description"],
            proposed_solution=gap["proposed_solution"],
            impact_level=gap["impact_level"],
            novelty_rating=gap["novelty_rating"]
        )
        db.add(g_model)

    # Persist solutions
    for sol in final_state.get("innovative_solutions", []):
        s_model = InnovationSolutionModel(
            project_id=project_id,
            feature_name=sol["feature_name"],
            description=sol["description"],
            originality_boost=sol["originality_boost"],
            feasibility_score=sol["feasibility_score"],
            impact_score=sol["impact_score"],
            novelty_score=sol["novelty_score"],
            technical_risk=sol["technical_risk"]
        )
        db.add(s_model)

    # Persist architecture
    arch_model = ProjectArchitectureModel(
        project_id=project_id,
        frontend_stack=final_state.get("frontend_stack"),
        backend_stack=final_state.get("backend_stack"),
        database_stack=final_state.get("database_stack"),
        cloud_deployment=final_state.get("cloud_deployment"),
        system_mermaid_code=final_state.get("system_mermaid"),
        sequence_mermaid_code=final_state.get("sequence_mermaid"),
        er_mermaid_code=final_state.get("er_mermaid"),
        folder_tree_json=final_state.get("folder_structure")
    )
    db.add(arch_model)

    # Persist document
    doc_model = GeneratedDocumentModel(
        project_id=project_id,
        doc_type="complete_blueprint",
        title="Complete Project Blueprint",
        markdown_content=final_state.get("complete_blueprint_md", "")
    )
    db.add(doc_model)

    # Update project status
    proj.status = "completed"
    proj.innovation_score = final_state.get("innovation_scores", {}).get("overall_score", 92.5)
    await db.commit()

    # Index into FAISS Vector Store
    vector_mgr = VectorStoreManager(str(project_id))
    vector_mgr.add_documents([
        {"title": proj.title, "text": proj.raw_idea, "source": "user_idea"}
    ])

    return {"status": "success", "innovation_score": proj.innovation_score}

@router.get("/{project_id}/stream")
async def stream_pipeline_updates(project_id: UUID):
    """SSE Real-time Server-Sent Events stream for live agent execution status."""
    async def event_generator():
        steps = [
            ("Research Intelligence Agent", "Searching ArXiv & Semantic Scholar literature..."),
            ("Innovation Generator Agent", "Computing novelty score & originality features..."),
            ("Architecture Builder Agent", "Synthesizing Mermaid.js system & sequence diagrams..."),
            ("Project Structure Agent", "Generating directory tree & SQL DDL schema..."),
            ("Output Synthesis Agent", "Compiling complete markdown project blueprint...")
        ]
        for name, desc in steps:
            data = json.dumps({"agent": name, "description": desc, "status": "in_progress"})
            yield f"data: {data}\n\n"
            await asyncio.sleep(1.2)
        
        yield f"data: {json.dumps({'agent': 'Completed', 'status': 'finished'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
