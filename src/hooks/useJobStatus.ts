/**
 * Custom hook for polling job status with automatic updates.
 */

import { useState, useEffect, useRef } from 'react';
import { getJobStatus } from '../services/api';
import { POLLING_INTERVAL } from '../utils/constants';
import type { Job, ApiError } from '../types/api';

export const useJobStatus = (jobId?: string, autoStart: boolean = true) => {
  const [status, setStatus] = useState<Job | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true);

  /**
   * Fetch current job status
   */
  const fetchStatus = async (): Promise<void> => {
    if (!jobId) return;

    try {
      const result = await getJobStatus(jobId);
      
      if (mountedRef.current) {
        setStatus(result);
        setError(null);
        setLastUpdated(new Date());

        // Stop polling if job is completed or failed
        if (result.status === 'completed' || result.status === 'failed') {
          stopPolling();
        }
      }
    } catch (err) {
      console.error('Failed to fetch job status:', err);
      if (mountedRef.current) {
        setError(err as ApiError);
        stopPolling();
      }
    }
  };

  /**
   * Start polling for status updates
   */
  const startPolling = (): void => {
    if (isPolling || !jobId) return;

    setIsPolling(true);
    setError(null);

    // Fetch immediately
    fetchStatus();

    // Set up interval for subsequent fetches
    intervalRef.current = setInterval(fetchStatus, POLLING_INTERVAL);
  };

  /**
   * Stop polling
   */
  const stopPolling = (): void => {
    setIsPolling(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /**
   * Manually refresh status
   */
  const refresh = (): void => {
    fetchStatus();
  };

  // Auto-start polling if jobId is provided and autoStart is true
  useEffect(() => {
    if (jobId && autoStart) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [jobId, autoStart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, []);

  return {
    status,
    isPolling,
    error,
    lastUpdated,
    startPolling,
    stopPolling,
    refresh
  };
};