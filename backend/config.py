from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    groq_api_key: str
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "ai_hub"
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cohere_api_key: str
    pinecone_api_key: str

    class Config:
        env_file = ".env"

settings = Settings()
