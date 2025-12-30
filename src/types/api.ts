/**
 * TypeScript type definitions for API requests and responses
 */

import { Status, Verdict, ErrorCode } from '../utils/constants';

// Error types
export interface ApiError {
  code: ErrorCode;
  message: string;
  correlationId?: string;
  details?: string;
  status?: number;
}

// Transcript types (matches Go models.Transcript)
export interface Transcript {
  id: string;
  filename: string;
  file_path: string;
  content_hash: string;
  word_count: number;
  uploaded_at: string;
  transcript_metadata?: any;
  analyses?: AnalysisResult[];
}

export interface TranscriptListResponse {
  transcripts: Transcript[];
  total: number;
  page: number;
  per_page: number;
}

// Upload types (matches Go services.UploadTranscriptResponse)
export interface UploadResponse {
  transcript_id: string;
  filename: string;
  word_count: number;
  message: string;
}

// Job types (matches Go services.JobStatusResponse)
export interface Job {
  id?: string; // For compatibility with existing code
  job_id: string;
  transcript_id: string;
  status: Status;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

// Analysis Job Response (matches Go services.AnalysisJobResponse)
export interface AnalysisJobResponse {
  job_id: string;
  transcript_id: string;
  status: Status;
  message: string;
}

// Fact Check types (matches Go services.FactCheckResultResponse)
export interface FactCheck {
  id: string;
  claim: string;
  verdict: Verdict;
  confidence: number;
  evidence?: string;
  sources?: string[];
  checked_at: string;
}

// Analysis Result types (matches Go services.AnalysisResultsResponse)
export interface AnalysisResult {
  id: string;
  job_id: string;
  transcript_id: string;
  status: Status;
  summary?: string;
  takeaways?: string[];
  fact_checks: FactCheck[];
  created_at: string;
  completed_at?: string;
  transcript_filename?: string;
  transcript_title?: string;
}

export interface AnalysisResultListResponse {
  results: AnalysisResult[];
  total: number;
  page: number;
  per_page: number;
}

// Health check
export interface HealthResponse {
  status: string;
  timestamp: string;
}

// Progress callback type
export type ProgressCallback = (percentCompleted: number) => void;