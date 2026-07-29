from typing import TypedDict, List, Dict, Any, Optional

class AgentState(TypedDict):
    project_id: str
    user_id: str
    raw_idea: str
    domain: str
    target_audience: Optional[str]

    # Agent 1: Research Output
    papers: List[Dict[str, Any]]
    research_summary: str
    research_gaps: List[Dict[str, Any]]

    # Agent 2: Innovation Output
    innovative_solutions: List[Dict[str, Any]]
    innovation_scores: Dict[str, float]
    unique_features: List[str]

    # Agent 3: Architecture Output
    frontend_stack: List[str]
    backend_stack: List[str]
    database_stack: List[str]
    cloud_deployment: List[str]
    system_mermaid: str
    sequence_mermaid: str

    # Agent 4: Project Structure Output
    folder_structure: Dict[str, Any]
    db_schema_sql: str
    er_mermaid: str
    api_documentation: str

    # Agent 5: Synthesis Output
    complete_blueprint_md: str
    research_report_md: str
    
    current_step: str
    error: Optional[str]
