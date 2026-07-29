from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.research_agent import run_research_agent
from agents.innovation_agent import run_innovation_agent
from agents.architecture_agent import run_architecture_agent
from agents.project_agent import run_project_agent
from agents.output_agent import run_output_agent

def build_innovation_graph():
    """Build the 5-Agent LangGraph StateGraph orchestration pipeline."""
    workflow = StateGraph(AgentState)

    # Add 5 Agent Nodes
    workflow.add_node("ResearchAgent", run_research_agent)
    workflow.add_node("InnovationAgent", run_innovation_agent)
    workflow.add_node("ArchitectureAgent", run_architecture_agent)
    workflow.add_node("ProjectAgent", run_project_agent)
    workflow.add_node("OutputAgent", run_output_agent)

    # Set Entry Point and Sequential Edges
    workflow.set_entry_point("ResearchAgent")
    workflow.add_edge("ResearchAgent", "InnovationAgent")
    workflow.add_edge("InnovationAgent", "ArchitectureAgent")
    workflow.add_edge("ArchitectureAgent", "ProjectAgent")
    workflow.add_edge("ProjectAgent", "OutputAgent")
    workflow.add_edge("OutputAgent", END)

    return workflow.compile()

innovation_graph = build_innovation_graph()
