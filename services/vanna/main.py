from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vanna_setup import vanna_service
import os

port = int(os.environ.get('PORT', 8000))

app = FastAPI(title="Vanna AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    success: bool
    question: str
    sql: str = None
    results: list = []
    row_count: int = 0
    error: str = None

@app.get("/")
def read_root():
    return {"message": "Vanna AI Service is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/query", response_model=QueryResponse)
def query_data(request: QueryRequest):
    """
    Ask a natural language question about your data
    """
    if not request.question:
        raise HTTPException(status_code=400, detail="Question is required")
    
    result = vanna_service.ask(request.question)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown error"))
    
    return QueryResponse(
        success=result["success"],
        question=result["question"],
        sql=result.get("sql", ""),
        results=result.get("results", []),
        row_count=result.get("row_count", 0)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
