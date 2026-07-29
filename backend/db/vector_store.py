import os
from typing import List, Dict, Any
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import settings
from logging_config import logger

class VectorStoreManager:
    def __init__(self, project_id: str, api_key: str = None):
        self.project_id = project_id
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.index_dir = os.path.join(settings.VECTOR_STORE_PATH, project_id)
        os.makedirs(self.index_dir, exist_ok=True)
        
        # Initialize Google Gemini Embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            google_api_key=self.api_key or "AIzaSy_placeholder"
        )
        self.vector_store = None

    def add_documents(self, docs_data: List[Dict[str, Any]]):
        """Index research paper snippets and project ideas into FAISS."""
        try:
            documents = []
            for item in docs_data:
                content = f"Title: {item.get('title', '')}\nContent: {item.get('text', '')}"
                metadata = {"source": item.get("source", "research_paper"), "id": item.get("id", "")}
                documents.append(Document(page_content=content, metadata=metadata))

            if not documents:
                return

            if self.vector_store is None:
                self.vector_store = FAISS.from_documents(documents, self.embeddings)
            else:
                self.vector_store.add_documents(documents)
            
            # Save index locally
            self.vector_store.save_local(self.index_dir)
            logger.info(f"Successfully indexed {len(documents)} docs into FAISS for project {self.project_id}")
        except Exception as e:
            logger.error(f"Error indexing vectors for project {self.project_id}: {str(e)}")

    def similarity_search(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """Perform semantic search for RAG chat context retrieval."""
        try:
            if os.path.exists(os.path.join(self.index_dir, "index.faiss")):
                self.vector_store = FAISS.load_local(
                    self.index_dir, 
                    self.embeddings, 
                    allow_dangerous_deserialization=True
                )

            if self.vector_store is None:
                return []

            results = self.vector_store.similarity_search(query, k=k)
            return [
                {"content": doc.page_content, "metadata": doc.metadata}
                for doc in results
            ]
        except Exception as e:
            logger.error(f"FAISS search error for project {self.project_id}: {str(e)}")
            return []
