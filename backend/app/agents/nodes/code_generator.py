from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.state import AgentState
from app.agents.tools.e2b_tools import get_e2b_tools
from functools import partial


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

SYSTEM_PROMPT = """You are an expert software developer assistant with access to an E2B sandbox environment.
You can create, read, and execute code in a live environment. Use the provided tools to:
1. Create project files and folders
2. Install necessary packages
3. Write code to files
4. Run commands to test the application
5. Read files to verify content
"""


def code_generator_node(state: AgentState) -> AgentState:
    """Generate code using LLM with E2B tools bound."""
    print("code generateor node, state: ", state)
    try:
        prompt = state.get('prompt')
        sandbox_id = state.get('sandbox_id')
        
        if not sandbox_id:
            state["error"] = "No sandbox_id found in state"
            return state
        
        tools = get_e2b_tools()
        tools_with_sandbox = [
            partial(tool.func, sandbox_id=sandbox_id) if 'sandbox_id' in tool.args else tool
            for tool in tools
        ]
        
        llm_with_tools = llm.bind_tools(tools)
        
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"Sandbox ID: {sandbox_id}\n\n{prompt}")
        ]
        
        response = llm_with_tools.invoke(messages)
        
        if response.tool_calls:
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                tool_args["sandbox_id"] = sandbox_id
                
                matching_tool = next((t for t in tools if t.name == tool_name), None)
                if matching_tool:
                    result = matching_tool.func(**tool_args)
                    state["content"] = (state.get("content") or "") + f"\n{result}"
        
        state["content"] = (state.get("content") or "") + f"\n\nAssistant: {response.content}"
        return state
        
    except Exception as e:
        state["error"] = f"Code generation failed: {str(e)}"
        return state
