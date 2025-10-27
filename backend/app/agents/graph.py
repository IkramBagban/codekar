from typing import AsyncGenerator
from app.agents.state import AgentState
from app.agents.nodes.code_generator import code_generator_node

from langgraph.graph import StateGraph,  START, END




    
def create_code_generation_graph():    
    agent_builder = StateGraph(AgentState)
    
    agent_builder.add_node("generate_code", code_generator_node)

    agent_builder.add_edge(START, "generate_code")
    agent_builder.add_edge("generate_code", END)
    
    return agent_builder.compile()


def generate_code_helper(
    prompt: str,
):
    
    graph = create_code_generation_graph()
    
    initial_state: AgentState = {"prompt": prompt, "content": None}
    print("initial_state", initial_state)
    
    try:
        response =   graph.invoke(initial_state)    
        print(" response", response)
        return response        
    except Exception as e:
        return {
            "type": "error",
            "content": f"Generation failed: {str(e)}"
        }
