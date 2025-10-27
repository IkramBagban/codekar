from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from langgraph.graph import StateGraph,  START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage


from typing import TypedDict

router = APIRouter(prefix="/api/v1")
class GenerateCode(BaseModel):
    prompt: str
    # generated_content: str
    
class State(TypedDict):
    prompt: str
    content: str


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

def generateCode(state: State)-> State:
    prompt = state.get('prompt')
    response = llm.invoke([HumanMessage(content=prompt)])
    state["content"] = response.content
    return state
    
    

@router.post("/generate")
async def generate(data: GenerateCode):
    # get the prompt
    agent_builder = StateGraph(State)
    prompt = data.prompt
    
    # add nodes
    agent_builder.add_node("generate_code", generateCode)
    
    
    # add edges
    agent_builder.add_edge(START, "generate_code")
    agent_builder.add_edge("generate_code", END)
    
    # defined initial state
    initial_state = {"prompt": prompt}

    # call graph invoke
    workflow = agent_builder.compile()
    response = workflow.invoke(initial_state)
    print("response ---> ", response)
    return {"response": response}