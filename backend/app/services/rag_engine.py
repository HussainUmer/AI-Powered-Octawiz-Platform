# app/services/rag_engine.py

import google.generativeai as genai
from app.cors.config import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)

async def query_rag(query: str) -> str:
    try:
        model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")
        response = model.generate_content([{"role": "user", "parts": [query]}])
        return response.text
    except Exception as e:
        print("Gemini API Error:", str(e))
        return "Sorry, I couldn't get a response from the AI model."
