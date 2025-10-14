from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker



load_dotenv()
app = FastAPI();


DATABASE_URL=os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Test the connection
connection = engine.connect()
print("Connected to PostgreSQL database successfully!")
connection.close()

Session = sessionmaker(bind=engine)
session = Session()

# Create a connection string
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name=Column(String)
    email=Column(String)
    password=Column(String)

print("User is defined")

Base.metadata.create_all(engine)
print("table created successfully.")



class UserModal(BaseModel):
    name: str | None = None
    email: str
    password: str

@app.get("/")
async def read_root():
    return {"message": "Hello world", "status": "success"}



@app.post("/register")
async def register(user: UserModal):
    print("user", user)
    newUser = User(name=user.email, email=user.email, password=user.password)
    session.add(newUser)
    session.commit()
    return {"data": user, "message": "User has been registered successfully."}