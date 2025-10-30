from e2b_code_interpreter import Sandbox
from app.agents.state import AgentState
from app.core.config import settings
import os


def create_sandbox_node(state: AgentState) -> AgentState:
    """Create and initialize E2B sandbox for code execution."""
    print("creating sandbox")
    try:
        os.environ["E2B_API_KEY"] = settings.E2B_API_KEY
        print("E2B_API_KEY", os.environ["E2B_API_KEY"])
        sandbox = Sandbox.create()
        print("sbox", sandbox)
        print("sandbox.sandbox_id", sandbox.sandbox_id)
        state["sandbox_id"] = sandbox.sandbox_id
        state["files"] = {}
        state["error"] = None
        print("state after creating sandbox", state)
        return state
    except Exception as e:
        state["error"] = f"Failed to create sandbox: {str(e)}"
        print("err=> ", e)
        return state


def cleanup_sandbox_node(state: AgentState) -> AgentState:
    """Cleanup and close the E2B sandbox."""
    try:
        sandbox_id = state.get("sandbox_id")
        if sandbox_id:
            sandbox = Sandbox(sandbox_id=sandbox_id)
            sandbox.kill()
        return state
    except Exception as e:
        state["error"] = f"Failed to cleanup sandbox: {str(e)}"
        return state
