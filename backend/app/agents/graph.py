from typing import AsyncGenerator
from app.agents.state import AgentState
from app.agents.nodes.code_generator import code_generator_node
from app.agents.nodes.sandbox_manager import create_sandbox_node, cleanup_sandbox_node
from langgraph.graph import StateGraph, START, END


def create_code_generation_graph():    
    agent_builder = StateGraph(AgentState)
    
    agent_builder.add_node("create_sandbox", create_sandbox_node)
    agent_builder.add_node("generate_code", code_generator_node)
    # agent_builder.add_node("cleanup_sandbox", cleanup_sandbox_node)

    agent_builder.add_edge(START, "create_sandbox")
    agent_builder.add_edge("create_sandbox", "generate_code")
    agent_builder.add_edge("generate_code", END)
    # agent_builder.add_edge("cleanup_sandbox", END)
    
    return agent_builder.compile()


def generate_code_helper(prompt: str):
    graph = create_code_generation_graph()
    
    initial_state: AgentState = {
        "prompt": prompt, 
        "content": None,
        "sandbox_id": None,
        "files": None,
        "error": None
    }
    
    try:
        response = graph.invoke(initial_state)
        print("response ", response)
        
        if response.get("error"):
            return {
                "type": "error",
                "content": response["error"],
                "sandbox_id": response.get("sandbox_id")
            }
        
        return {
            "type": "success",
            "content": response.get("content"),
            "sandbox_id": response.get("sandbox_id"),
            "files": response.get("files")
        }
    except Exception as e:
        return {
            "type": "error",
            "content": f"Generation failed: {str(e)}"
        }
