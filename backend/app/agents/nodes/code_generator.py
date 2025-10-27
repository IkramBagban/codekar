from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.state import AgentState


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

def code_generator_node(state: AgentState)-> AgentState:
    prompt = state.get('prompt')
    response = llm.invoke([HumanMessage(content=prompt)])
    state["content"] = response.content
    return state
