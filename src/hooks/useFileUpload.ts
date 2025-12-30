/**
 * Custom hook for handling file uploads with progress tracking and validation.
 */

import { useState } from 'react';
import { uploadTranscript } from '../services/api';
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from '../utils/constants';
import type { ApiError, UploadResponse } from '../types/api';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface UploadResult {
  success: boolean;
  data?: UploadResponse;
  error?: ApiError;
}

interface UploadSuccess {
  message: string;
  transcript: UploadResponse;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<ApiError | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<UploadSuccess | null>(null);

  /**
   * Validate file before upload
   */
  const validateFile = (file: File | null): ValidationResult => {
    const errors: string[] = [];

    if (!file) {
      errors.push('Please select a file to upload');
      return { valid: false, errors };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxMB = MAX_FILE_SIZE / (1024 * 1024);
      errors.push(`File size must be less than ${maxMB}MB`);
    }

    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension as any)) {
      errors.push(`File type not supported. Please upload ${ALLOWED_EXTENSIONS.join(' or ')} files`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  /**
   * Upload file with progress tracking
   */
  const upload = async (file: File): Promise<UploadResult> => {
    // Reset states
    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress(0);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      const error: ApiError = {
        code: 'VALIDATION_ERROR' as any,
        message: validation.errors.join('. ')
      };
      setUploadError(error);
      return { success: false, error };
    }

    setIsUploading(true);

    try {
      const result = await uploadTranscript(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadSuccess({
        message: result.message,
        transcript: result
      });

      return { success: true, data: result };

    } catch (error) {
      console.error('Upload failed:', error);
      const apiError = error as ApiError;
      setUploadError(apiError);
      return { success: false, error: apiError };

    } finally {
      setIsUploading(false);
      // Keep progress at 100% briefly if successful
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  /**
   * Reset upload state
   */
  const resetUpload = (): void => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);
  };

  return {
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    upload,
    validateFile,
    resetUpload
  };
};