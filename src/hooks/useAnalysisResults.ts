/**
 * Custom hook for managing analysis results data.
 */

import { useState } from 'react';
import { getAnalysisResults, getAnalysisResultsList } from '../services/api';
import type { AnalysisResult, ApiError } from '../types/api';

interface Pagination {
  page: number;
  perPage: number;
  total: number;
}

export const useAnalysisResults = () => {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [resultsList, setResultsList] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 20,
    total: 0
  });

  /**
   * Fetch analysis results by ID
   */
  const fetchResults = async (analysisId: string): Promise<void> => {
    if (!analysisId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getAnalysisResults(analysisId);
      setResults(data);
    } catch (err) {
      console.error('Failed to fetch analysis results:', err);

      const apiError = err as ApiError;

      // If analysis is not completed (409 error), don't treat as error
      if (apiError.status === 409 || apiError.code === 'ANALYSIS_NOT_COMPLETED') {
        setResults(null);
        setError(null);
      } else {
        setError(apiError);
        setResults(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch list of analysis results
   */
  const fetchResultsList = async (page: number = 1, perPage: number = 20): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      console.log("getting analysis result list");
      const data = await getAnalysisResultsList(page, perPage);
      setResultsList(data.results);
      setPagination({
        page: data.page,
        perPage: data.per_page,
        total: data.total
      });
    } catch (err) {
      console.error('Failed to fetch analysis results list:', err);
      setError(err as ApiError);
      setResultsList([]);
    } finally {
      console.log("setting loading to false.")
      setLoading(false);
    }
  };

  /**
   * Clear current results
   */
  const clearResults = (): void => {
    setResults(null);
    setError(null);
  };

  /**
   * Clear results list
   */
  const clearResultsList = (): void => {
    setResultsList([]);
    setError(null);
    setPagination({ page: 1, perPage: 20, total: 0 });
  };

  return {
    // Single result
    results,
    fetchResults,
    clearResults,

    // Results list
    resultsList,
    fetchResultsList,
    clearResultsList,
    pagination,

    // Common state
    loading,
    error
  };
};
