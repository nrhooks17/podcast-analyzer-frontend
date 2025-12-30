/**
 * API client for communicating with the backend.
 * Handles all HTTP requests with error handling and logging.
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, ERROR_CODES } from '../utils/constants';
import type {
  ApiError,
  UploadResponse,
  TranscriptListResponse,
  Transcript,
  Job,
  AnalysisResult,
  AnalysisResultListResponse,
  HealthResponse,
  ProgressCallback
} from '../types/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // Transform error to standard format
    const transformedError = transformError(error);
    return Promise.reject(transformedError);
  }
);

/**
 * Transform axios error to application error format
 */
const transformError = (error: AxiosError): ApiError => {
  if (!error.response) {
    // Network error
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Unable to connect to the server. Please check your internet connection.',
      details: error.message
    };
  }

  const { status, data } = error.response;
  
  // Server returned error response
  if (data && typeof data === 'object' && 'error' in data) {
    const errorData = data as any;
    return {
      code: errorData.error.code || ERROR_CODES.INTERNAL_ERROR,
      message: errorData.error.message || 'An unexpected error occurred',
      correlationId: errorData.error.correlation_id,
      details: errorData.error.details
    };
  }

  // Default error handling based on status code
  const statusMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication required.',
    403: 'Access denied.',
    404: 'Resource not found.',
    409: 'Analysis not yet completed.',
    422: 'Invalid data provided.',
    500: 'Internal server error. Please try again later.',
    503: 'Service temporarily unavailable.'
  };

  return {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: statusMessages[status] || 'An unexpected error occurred',
    status
  };
};

/**
 * Upload a transcript file
 */
export const uploadTranscript = async (file: File, onProgress?: ProgressCallback): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    };
  }

  const response = await api.post('/api/transcripts/', formData, config);
  return response.data;
};

/**
 * Get list of transcripts
 */
export const getTranscripts = async (page: number = 1, perPage: number = 20): Promise<TranscriptListResponse> => {
  const response = await api.get('/api/transcripts/', {
    params: { page, per_page: perPage }
  });
  return response.data;
};

/**
 * Get transcript by ID
 */
export const getTranscript = async (transcriptId: string): Promise<Transcript> => {
  const response = await api.get(`/api/transcripts/${transcriptId}`);
  return response.data;
};

/**
 * Delete transcript
 */
export const deleteTranscript = async (transcriptId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/transcripts/${transcriptId}`);
  return response.data;
};

/**
 * Start analysis for a transcript
 */
export const startAnalysis = async (transcriptId: string): Promise<Job> => {
  const response = await api.post(`/api/analyze/${transcriptId}`);
  return response.data;
};

/**
 * Get job status
 */
export const getJobStatus = async (jobId: string): Promise<Job> => {
  const response = await api.get(`/api/jobs/${jobId}/status`);
  return response.data;
};

/**
 * Get analysis results
 */
export const getAnalysisResults = async (analysisId: string): Promise<AnalysisResult> => {
  const response = await api.get(`/api/results/${analysisId}`);
  return response.data;
};

/**
 * Get list of analysis results
 */
export const getAnalysisResultsList = async (page: number = 1, perPage: number = 20): Promise<AnalysisResultListResponse> => {
  const response = await api.get('/api/results', {
    params: { page, per_page: perPage }
  });
  return response.data;
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<HealthResponse> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;