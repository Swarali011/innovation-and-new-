import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from db.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = Column(String(128), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False)
    display_name = Column(String(255), nullable=True)
    photo_url = Column(Text, nullable=True)
    gemini_api_key_override = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    projects = relationship("ProjectModel", back_populates="user", cascade="all, delete-orphan")

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    raw_idea = Column(Text, nullable=False)
    domain = Column(String(100), default="General CS/AI")
    target_audience = Column(Text, nullable=True)
    status = Column(String(50), default="draft")  # draft, processing, completed, failed
    current_agent_step = Column(String(100), nullable=True)
    innovation_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserModel", back_populates="projects")
    papers = relationship("ResearchPaperModel", back_populates="project", cascade="all, delete-orphan")
    gaps = relationship("ResearchGapModel", back_populates="project", cascade="all, delete-orphan")
    solutions = relationship("InnovationSolutionModel", back_populates="project", cascade="all, delete-orphan")
    architecture = relationship("ProjectArchitectureModel", back_populates="project", uselist=False, cascade="all, delete-orphan")
    documents = relationship("GeneratedDocumentModel", back_populates="project", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessageModel", back_populates="project", cascade="all, delete-orphan")

class ResearchPaperModel(Base):
    __tablename__ = "research_papers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    authors = Column(JSON, nullable=True) # List of author strings
    published_year = Column(Integer, nullable=True)
    abstract = Column(Text, nullable=True)
    url = Column(Text, nullable=True)
    source = Column(String(50), default="arxiv") # arxiv, semantic_scholar
    relevance_score = Column(Float, default=0.0)
    key_findings = Column(JSON, nullable=True) # List of strings
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="papers")

class ResearchGapModel(Base):
    __tablename__ = "research_gaps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False) # technical, methodological, domain_application
    description = Column(Text, nullable=False)
    proposed_solution = Column(Text, nullable=False)
    impact_level = Column(String(50), default="High")
    novelty_rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="gaps")

class InnovationSolutionModel(Base):
    __tablename__ = "innovation_solutions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    feature_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    originality_boost = Column(Text, nullable=True)
    feasibility_score = Column(Float, default=0.0)
    impact_score = Column(Float, default=0.0)
    novelty_score = Column(Float, default=0.0)
    technical_risk = Column(String(50), default="Low")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="solutions")

class ProjectArchitectureModel(Base):
    __tablename__ = "project_architectures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    frontend_stack = Column(JSON, nullable=True)
    backend_stack = Column(JSON, nullable=True)
    database_stack = Column(JSON, nullable=True)
    cloud_deployment = Column(JSON, nullable=True)
    system_mermaid_code = Column(Text, nullable=True)
    sequence_mermaid_code = Column(Text, nullable=True)
    er_mermaid_code = Column(Text, nullable=True)
    folder_tree_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="architecture")

class GeneratedDocumentModel(Base):
    __tablename__ = "generated_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    doc_type = Column(String(50), nullable=False) # complete_blueprint, research_report
    title = Column(String(255), nullable=False)
    markdown_content = Column(Text, nullable=False)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="documents")

class ChatMessageModel(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False) # user, assistant
    message = Column(Text, nullable=False)
    context_chunks = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="chat_messages")
