from typing import TypedDict, List, Optional, Annotated
from typing_extensions import TypedDict as TypedDictExt


class AgentState(TypedDict):
    prompt: str
    content: str
