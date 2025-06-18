# app/api/routes.py
from fastapi import APIRouter
from app.models.schema import QueryRequest, QueryResponse
from app.services.rag_engine import query_rag

router = APIRouter()

@router.post("/ask", response_model=QueryResponse)
async def ask_query(data: QueryRequest):
    return {"response": await query_rag(data.query)}
