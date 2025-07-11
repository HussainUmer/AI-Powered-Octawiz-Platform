# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(title="Octowize RAG API")

origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://ai-powered-octawiz-platform.vercel.app")
allowed_origins = [origin.strip() for origin in origins_str.split(',')]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api")
