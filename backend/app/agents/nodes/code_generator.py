from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.state import AgentState
from app.agents.tools.e2b_tools import get_e2b_tools
from functools import partial


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

SYSTEM_PROMPT = """You are an expert react developer assistant with access to an E2B sandbox environment.
You can create, read, and execute code in a live environment. Use the provided tools to:
1. Create project files and folders
2. Install necessary packages
3. Write code to files
4. Run commands to test the application
5. Read files to verify content

Give project a name according to the prompt and ensure all code is relevant to the project requirements.
you have `pull_template_in_sandbox` which will pull a react template into the sandbox.
and you'll always use react if user says to build in some other language than don't do anything that you can only create react projects.
and pull react template if its already not there, you can check that by listing files in the sandbox.
and after that you can modify the code as per the prompt. follow react best practices.
don't create readme.md files.
don't include any comments or documentation.
you have a run command tool you can use to run shell commands in the sandbox.
and whenever you need it, to run the project, to install dependencies or start the development server,.
anything else you need to do, use the tools as necessary.
 use that tool to listout the files in you can use `list_files`
"""


def code_generator_node(state: AgentState) -> AgentState:
    """Generate code using LLM with E2B tools bound. 

    Args:
        state (AgentState): The current state containing 'prompt' and 'sandbox_id'.
    """
    print("code generator node, state: ", state)
    try:
        prompt = state.get('prompt')
        sandbox_id = state.get('sandbox_id')
        
        if not sandbox_id:
            state["error"] = "No sandbox_id found in state"
            return state
        
        tools = get_e2b_tools()
        llm_with_tools = llm.bind_tools(tools)
        
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"Sandbox ID: {sandbox_id}\n\n{prompt}")
        ]
        
        max_iterations = 15
        iteration = 0
        all_tool_results = []
        
        while iteration < max_iterations:
            iteration += 1
            print(f"\n--- Iteration {iteration} ---")
            
            response = llm_with_tools.invoke(messages)
            print(f"Tool calls: {len(response.tool_calls) if response.tool_calls else 0}")
            
            if not response.tool_calls:
                print("No more tool calls, finishing...")
                all_tool_results.append(f"Assistant: {response.content}")
                break
            
            tool_messages = []
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                tool_args["sandbox_id"] = sandbox_id
                
                print(f"Calling tool: {tool_name}")
                
                matching_tool = next((t for t in tools if t.name == tool_name), None)
                if matching_tool:
                    result = matching_tool.func(**tool_args)
                    all_tool_results.append(f"Tool {tool_name}: {result}")
                    
                    tool_messages.append(
                        ToolMessage(
                            content=str(result),
                            tool_call_id=tool_call["id"]
                        )
                    )
            
            messages.append(response)
            messages.extend(tool_messages)
        
        state["content"] = "\n".join(all_tool_results)
        return state
        
    except Exception as e:
        state["error"] = f"Code generation failed: {str(e)}"
        print(f"Error in code_generator_node: {e}")
        return state
