/**
 * Application constants and configuration values.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed'
} as const;

export const VERDICT_LABELS = {
  true: 'True',
  false: 'False',
  partially_true: 'Partially True',
  unverifiable: 'Unverifiable'
} as const;

export const POLLING_INTERVAL = 3000; // 3 seconds

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_EXTENSIONS = ['.txt', '.json'] as const;

export const ERROR_CODES = {
  FILE_VALIDATION_ERROR: 'FILE_VALIDATION_ERROR',
  DUPLICATE_TRANSCRIPT: 'DUPLICATE_TRANSCRIPT',
  TRANSCRIPT_NOT_FOUND: 'TRANSCRIPT_NOT_FOUND',
  ANALYSIS_NOT_FOUND: 'ANALYSIS_NOT_FOUND',
  ANALYSIS_NOT_COMPLETED: 'ANALYSIS_NOT_COMPLETED',
  JOB_NOT_FOUND: 'JOB_NOT_FOUND',
  MISSING_PARAMETERS: 'MISSING_PARAMETERS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const;

// Type definitions
export type Status = keyof typeof STATUS_LABELS;
export type Verdict = keyof typeof VERDICT_LABELS;
export type ErrorCode = keyof typeof ERROR_CODES;