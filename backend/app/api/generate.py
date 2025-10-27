from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.graph import generate_code_helper

router = APIRouter(prefix="/api/v1")
class GenerateCode(BaseModel):
    prompt: str

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

@router.post("/generate")
async def generate(data: GenerateCode):
    prompt = data.prompt
    response = generate_code_helper(prompt)
    print("response ---> ", response)
    return {"response": response}