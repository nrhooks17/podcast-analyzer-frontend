/**
 * File upload component with drag-and-drop support.
 */

import React, { useState, useRef } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import ProgressBar from '../common/ProgressBar';
import ErrorMessage from '../common/ErrorMessage';
import Button from '../common/Button';
import type { UploadResponse, ApiError } from '../../types/api';

interface FileUploadProps {
  onUploadSuccess?: (transcript: UploadResponse) => void;
  onUploadError?: (error: ApiError) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    upload,
    resetUpload
  } = useFileUpload();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File): void => {
    setSelectedFile(file);
    resetUpload();
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) return;

    const result = await upload(selectedFile);
    
    if (result.success && result.data) {
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (result.error) {
      if (onUploadError) {
        onUploadError(result.error);
      }
    }
  };

  const handleClear = (): void => {
    setSelectedFile(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-upload">
      {/* Drag and Drop Area */}
      <div
        className={`upload-area ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
        
        {!selectedFile ? (
          <>
            <h3>Upload Podcast Transcript</h3>
            <p>Drag and drop your transcript file here, or click to select</p>
            <p className="file-info">
              Supports .txt and .json files up to 10MB
            </p>
          </>
        ) : (
          <>
            <h3>File Selected</h3>
            <p><strong>{selectedFile.name}</strong></p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </>
        )}
      </div>

      {/* File Actions */}
      {selectedFile && (
        <div className="file-actions button-group">
          <Button
            onClick={handleUpload}
            loading={isUploading}
            disabled={isUploading}
            variant="primary"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
          
          <Button
            onClick={handleClear}
            disabled={isUploading}
            variant="secondary"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="upload-progress">
          <ProgressBar progress={uploadProgress} />
          <p>Uploading: {uploadProgress}%</p>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="success">
          <h4>Upload Successful</h4>
          <p>{uploadSuccess.message}</p>
          <p>
            <strong>Word Count:</strong> {uploadSuccess.transcript.word_count?.toLocaleString()}
          </p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <ErrorMessage
          error={uploadError}
          onRetry={selectedFile ? handleUpload : undefined}
        />
      )}
    </div>
  );
};


export default FileUpload;