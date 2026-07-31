export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  geminiApiKey?: string;
}

export type PipelineStepStatus = 'idle' | 'pending' | 'in_progress' | 'completed' | 'failed';

export interface AgentStepProgress {
  id: string;
  name: string;
  agentName: string;
  description: string;
  status: PipelineStepStatus;
  outputSummary?: string;
  timestamp?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  publishedYear: number;
  journal?: string;
  abstract: string;
  citationCount?: number;
  doi?: string;
  url: string;
  pdfUrl?: string;
  isEmbeddable?: boolean;
  source: 'arxiv' | 'semantic_scholar' | 'web';
  relevanceScore: number;
  keyFindings: string[];
}

export interface ResearchGap {
  id: string;
  category: 'technical' | 'methodological' | 'domain_application';
  description: string;
  proposedSolution: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  noveltyRating: number; // 0 to 100
}

export interface GitHubRepository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  owner: string;
  owner_avatar?: string;
  stars: number;
  forks: number;
  watchers?: number;
  open_issues?: number;
  primary_language: string;
  topics: string[];
  last_updated: string;
  license: string;
  html_url: string;
  relevance_score: number;
}

export interface GitHubRepoDetails {
  owner: string;
  repo: string;
  full_name: string;
  readme_md: string;
  file_tree: Array<{ path: string; type: string }>;
  languages: Record<string, number>;
  commits: Array<{ sha: string; message: string; author: string; date: string }>;
  open_issues: number;
  stars: number;
  forks: number;
  html_url: string;
}

export interface RoadmapPhase {
  phase_id: string;
  phase_number: number;
  title: string;
  estimated_duration: string;
  status?: 'pending' | 'in_progress' | 'completed';
  deliverables: string[];
  required_skills: string[];
  suggested_tools: string[];
  potential_risks: string[];
}

export interface InnovationSolution {
  id: string;
  featureName: string;
  description: string;
  originalityBoost: string;
  feasibilityScore: number; // 0 - 100
  impactScore: number;      // 0 - 100
  noveltyScore: number;     // 0 - 100
  technicalRisk: 'Low' | 'Medium' | 'High';
}

export interface InnovationScores {
  originality: number;
  feasibility: number;
  impact: number;
  novelty: number;
  overallScore: number;
}

export interface ArchitectureSpec {
  frontendStack: string[];
  backendStack: string[];
  databaseStack: string[];
  cloudDeployment: string[];
  systemMermaidCode: string;
  sequenceMermaidCode: string;
  erMermaidCode: string;
  folderTreeJson: Record<string, any>;
}

export interface GeneratedDocument {
  id: string;
  docType: 'complete_blueprint' | 'research_report' | 'api_doc' | 'system_arch' | 'literature_survey';
  title: string;
  markdownContent: string;
  version: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  contextChunks?: string[];
  timestamp: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  rawIdea: string;
  domain: string;
  targetAudience?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  currentStep?: string;
  innovationScore: number;
  createdAt: string;
  updatedAt: string;
  papers?: ResearchPaper[];
  gaps?: ResearchGap[];
  solutions?: InnovationSolution[];
  scores?: InnovationScores;
  architecture?: ArchitectureSpec;
  documents?: GeneratedDocument[];
}
