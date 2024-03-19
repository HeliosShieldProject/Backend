import os
from pydantic import BaseModel
from dotenv import load_dotenv


class EnvData(BaseModel):
    AGENT_BACKEND_PORT: str
    MASTER_BACKEND_PORT: str
    DATABASE_PORT: str
    DATABASE_NAME: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str


def load_environment() -> EnvData:
    load_dotenv()
    return EnvData(
        AGENT_BACKEND_PORT=os.getenv("AGENT_BACKEND_PORT"),
        MASTER_BACKEND_PORT=os.getenv("MASTER_BACKEND_PORT"),
        DATABASE_PORT=os.getenv("DATABASE_PORT"),
        DATABASE_NAME=os.getenv("DATABASE_NAME"),
        DATABASE_USER=os.getenv("DATABASE_USER"),
        DATABASE_PASSWORD=os.getenv("DATABASE_PASSWORD"),
    )


ENV = load_environment()
