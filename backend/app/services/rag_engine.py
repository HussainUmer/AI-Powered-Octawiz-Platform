# app/services/rag_engine.py

import os
from typing import Optional, List
from fastapi import HTTPException
from dotenv import load_dotenv
import google.generativeai as genai
from langchain.chains import create_history_aware_retriever, create_retrieval_chain, LLMChain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_chroma import Chroma
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
import uuid
from uuid import uuid4
import time
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type
import logging
from chromadb.utils import embedding_functions  # Import Chroma embedding functions
from langchain_community.vectorstores import LanceDB



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Google Generative AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Define paths
app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
persistent_directory = os.path.join(app_dir, "db", "lancedb")
folder_path = os.path.join(app_dir, "Freezone_Research")  # Folder containing PDFs

# Initialize vector store
if not os.path.exists(persistent_directory):
    logger.info("Persistent directory does not exist. Initializing LanceDB vector store...")

    # Ensure folder exists
    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"The folder {folder_path} does not exist.")

    # Load all PDF files from the folder
    documents = []
    pdf_files = [f for f in os.listdir(folder_path) if f.endswith('.pdf')]
    
    if not pdf_files:
        raise FileNotFoundError(f"No PDF files found in {folder_path}.")

    # Process each PDF file
    for pdf_file in pdf_files:
        file_path = os.path.join(folder_path, pdf_file)
        loader = PyPDFLoader(file_path)
        documents.extend(loader.load())

    # Split documents
    text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)

    logger.info(f"Number of document chunks: {len(docs)}")
    logger.info(f"Sample chunk:\n{docs[0].page_content}\n")

    # Sanitize metadata
    for doc in docs:
        if not isinstance(doc.metadata, dict):
            doc.metadata = {}
        doc.metadata = {k: str(v) for k, v in doc.metadata.items()}

    # Initialize LanceDB
    logger.info("Creating new LanceDB table...")
    vector_store = LanceDB.from_documents(
        documents=docs,
        embedding=embeddings,
        uri=persistent_directory,
        table_name="example_collection"
    )
    logger.info("LanceDB vector store initialized successfully.")
else:
    logger.info("Loading existing LanceDB vector store...")
    vector_store = LanceDB(
        uri=persistent_directory,
        embedding=embeddings,
        table_name="example_collection"
    )

retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 3})


# Initialize LLM with gemini-2.0-flash
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))

# Contextualize question prompt
contextualize_q_system_prompt = (
    "Given user question "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, just "
    "reformulate it if needed and otherwise return it as is."
)
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)


# Create history-aware retriever
history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

# Answer question prompt
qa_system_prompt = (
    "You are an AI assistant helping users with questions about UAE Freezones and business setup.\n"
    "You will be given a context. If the context is helpful, use it to answer the question.\n"
    "If the context is empty or irrelevant, DO NOT guess. Instead, return exactly this:\n"
    "__NO_CONTEXT__\n"
    "Otherwise, provide a helpful answer (max 3 sentences).\n\n"
    "Context:\n{context}"
)
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)


# Create question-answering and retrieval chains
question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

chat_history = []

async def query_rag(query: str, session_id: str = str(uuid.uuid4())) -> Optional[str]:
    """
    Query the RAG engine using LangChain with Gemini 2.0 Flash.

    Args:
        query (str): The user query to process.
        session_id (str, optional): Unique identifier for the user session to track chat history.
                                   Defaults to a new UUID if not provided.

    Returns:
        Optional[str]: The generated response or None if an error occurs.

    Raises:
        HTTPException: If the query is invalid or an error occurs during processing.
    """
    if not query or not isinstance(query, str):
        raise HTTPException(status_code=400, detail="Invalid or empty query")

    logger.info(f"Querying RAG with data: query='{query}', session_id='{session_id}'")
    logger.info(f"Querying RAG with query: {query}")
    logger.info(f"chat_history: {chat_history}")

    try:
        # Retrieve chat history from Supabase (commented out for now)
        # response = supabase_client.table("chat_history").select("*").eq("session_id", session_id).execute()
        # chat_history = [HumanMessage(content=msg["content"]) if msg["role"] == "human" else SystemMessage(content=msg["content"]) 
        #                 for msg in response.data] if response.data else []

        # Call the RAG chain
        result = await rag_chain.ainvoke({"input": query, "chat_history": chat_history})
        response = result["answer"].strip()
        logger.info(f"RAG response: {response}")

        # Append messages locally (for fallback purposes)
        chat_history.append(HumanMessage(content=query))
        chat_history.append(SystemMessage(content=response))

        # Trigger fallback if special token is returned
        if "__NO_CONTEXT__" in response:
            logger.warning("Fallback triggered due to missing context flag from prompt.")
            fallback_prompt = [
                SystemMessage(content=(
                "You are an AI assistant helping users decide between UAE free zones.\n"
                "Use numbered lists only for steps or options.\n"
                "Do not use bold (**), asterisks (*), or Markdown.\n"
                "Respond only in clean plain text with no special characters or formatting.\n"
                "Each point should be on a new line and start with '1.', '2.', etc.\n"
                "Be professional and clear."
            )),
                *chat_history,
                HumanMessage(content=query)
            ]
            fallback_response = await llm.ainvoke(fallback_prompt)
            return fallback_response.content.strip()

        # Return normal RAG response
        return response

    except Exception as e:
        logger.error(f"Error in query_rag: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process query")







# # Chain that rewrites the user query into a history-independent question
# question_generator_chain = LLMChain(
#     llm=llm,
#     prompt=contextualize_q_prompt
# )



# # ---------- REPLACE YOUR OLD query_rag WITH THIS ----------
# async def query_rag(
#     query: str,
#     session_id: str = str(uuid.uuid4())
# ) -> Optional[str]:
#     """
#     Debug-friendly RAG call: logs the standalone question, retrieved docs,
#     and the final answer.

#     Returns
#     -------
#     str | None
#         A concise answer from Gemini-Flash (or raises HTTPException on error)
#     """
#     if not query or not isinstance(query, str):
#         raise HTTPException(status_code=400, detail="Invalid or empty query")

#     logger.info("─" * 50)
#     logger.info(f"Original query : {query}")
#     logger.info(f"Session ID     : {session_id}")

#     try:
#         # ───────────────────────────────────────────────────────── chat history
#         # TODO: pull / push from Supabase once ready
#         chat_history: List = []

#         # ───────────────────────────── 1) Stand-alone-question generation
#         qg_response = await question_generator_chain.ainvoke(
#             {"input": query, "chat_history": chat_history}
#         )
#         standalone_question = (
#             qg_response.get("text") if isinstance(qg_response, dict) else qg_response
#         ).strip()

#         logger.info(f"[1] Stand-alone question ➜ {standalone_question}")

#         # ───────────────────────────── 2) Retrieval
#         retrieved_docs = await retriever.ainvoke(standalone_question)
#         logger.info(f"[2] Retrieved {len(retrieved_docs)} document(s)")
#         for i, doc in enumerate(retrieved_docs, 1):
#             snippet = doc.page_content.replace("\n", " ")[:200] + "…"
#             logger.info(
#                 f"    Doc {i:02d} | meta={doc.metadata} | snippet=\"{snippet}\""
#             )

#         # ───────────────────────────── 3) QA synthesis

#         # Manually format prompt to inspect exactly what LLM sees
#         formatted_messages = qa_prompt.format_messages(
#             input=query,
#             context=retrieved_docs,
#             chat_history=chat_history
#         )
#         compiled_prompt = "\n".join([f"{msg.type.upper()}: {msg.content}" for msg in formatted_messages])
#         logger.info("[3] Prompt sent to LLM:\n" + compiled_prompt)
#         qa_response = await question_answer_chain.ainvoke(
#             {
#                 "input": query,
#                 "context": retrieved_docs,
#                 "chat_history": chat_history,
#             }
#         )
#         answer = (
#             qa_response.get("answer") if isinstance(qa_response, dict) else qa_response
#         ).strip()

#         logger.info(f"[4] Final answer ➜ {answer}")
#         logger.info("─" * 50)

#         return answer

#     except Exception as e:
#         logger.error(f"query_rag() error ➜ {e}")
#         raise HTTPException(status_code=500, detail="Failed to process query")
























# # app/services/rag_engine.py

# import google.generativeai as genai
# from app.cors.config import GOOGLE_API_KEY

# genai.configure(api_key=GOOGLE_API_KEY)

# async def query_rag(query: str) -> str:
#     try:
#         model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")
#         response = model.generate_content([{"role": "user", "parts": [query]}])
#         return response.text
#     except Exception as e:
#         print("Gemini API Error:", str(e))
#         return "Sorry, I couldn't get a response from the AI model."
