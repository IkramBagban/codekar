from typing import TypedDict, List, Optional, Dict, Any
from typing_extensions import TypedDict as TypedDictExt


class AgentState(TypedDict):
    prompt: str
    content: Optional[str]
    sandbox_id: Optional[str]
    files: Optional[Dict[str, Any]]
    error: Optional[str]
