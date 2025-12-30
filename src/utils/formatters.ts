/**
 * Utility functions for formatting data display.
 */

import { Status, Verdict } from './constants';

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format confidence score as percentage
 */
export const formatConfidence = (confidence: number | undefined | null): string => {
  if (confidence === undefined || confidence === null) return '0%';
  return Math.round(confidence * 100) + '%';
};

/**
 * Format word count with commas
 */
export const formatWordCount = (count: number): string => {
  if (!count) return '0';
  return count.toLocaleString();
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Get CSS class for status
 */
export const getStatusClass = (status: Status): string => {
  const classes: Record<Status, string> = {
    pending: 'status-pending',
    processing: 'status-processing',
    completed: 'status-completed',
    failed: 'status-failed'
  };
  return classes[status] || 'status-pending';
};

/**
 * Get CSS class for verdict
 */
export const getVerdictClass = (verdict: Verdict): string => {
  const classes: Record<Verdict, string> = {
    true: 'verdict-true',
    false: 'verdict-false',
    partially_true: 'verdict-partially-true',
    unverifiable: 'verdict-unverifiable'
  };
  return classes[verdict] || 'verdict-unverifiable';
};