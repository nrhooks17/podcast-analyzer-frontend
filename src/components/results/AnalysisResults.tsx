/**
 * Main component for displaying complete analysis results.
 */

import React, { useEffect } from 'react';
import { useJobStatus } from '../../hooks/useJobStatus';
import { useAnalysisResults } from '../../hooks/useAnalysisResults';
import Summary from './Summary';
import KeyTakeaways from './KeyTakeaways';
import FactCheckTable from './FactCheckTable';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Card from '../common/Card';
import Button from '../common/Button';
import AnalysisProgress from '../common/AnalysisProgress';
import { getStatusClass } from '../../utils/formatters';
import { STATUS_LABELS } from '../../utils/constants';
import { generateMarkdown, downloadMarkdown, generateFilename } from '../../utils/markdownExporter';

interface AnalysisResultsProps {
  jobId?: string;
  analysisId?: string;
  autoRefresh?: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ jobId, analysisId, autoRefresh = true }) => {
  const {
    status: jobStatus,
    error: jobError,
    refresh: refreshStatus
  } = useJobStatus(jobId, autoRefresh && !analysisId);

  const {
    results,
    fetchResults,
    loading: resultsLoading,
    error: resultsError
  } = useAnalysisResults();

  // Handle markdown download
  const handleDownloadMarkdown = (): void => {
    if (!results) return;

    const markdown = generateMarkdown(results);
    const filename = generateFilename(results);
    downloadMarkdown(markdown, filename);
  };

  // Fetch results when analysis is completed
  useEffect(() => {
    if (analysisId) {
      fetchResults(analysisId);
    } else if (jobStatus && jobStatus.status === 'completed') {
      // Get analysis ID from job status and fetch results
      const analysis = (jobStatus as any).analysis || { id: jobStatus.id };
      fetchResults(analysis.id);
    }
  }, [analysisId, jobStatus]);

  // Show job status while processing
  if (!results && jobStatus && jobStatus.status !== 'completed') {
    return (
      <div className="analysis-status">
        <Card title="Analysis Status">
          <div className="status-info">
            <div className="status-row">
              <span>Job ID:</span>
              <span className="job-id">{(jobStatus as any).job_id}</span>
            </div>

            <div className="status-row">
              <span>Started:</span>
              <span>{new Date(jobStatus.created_at).toLocaleString()}</span>
            </div>

            {(jobStatus as any).error_message && (
              <div className="status-row">
                <span>Error:</span>
                <span className="error-message">{(jobStatus as any).error_message}</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {(jobStatus.status === 'pending' || jobStatus.status === 'processing') && (
            <AnalysisProgress
              status={jobStatus.status}
              startTime={jobStatus.created_at}
            />
          )}

          {jobStatus.status === 'failed' && (
            <AnalysisProgress
              status="failed"
              startTime={jobStatus.created_at}
            />
          )}
        </Card>
      </div>
    );
  }

  // Show loading while fetching results
  if (resultsLoading) {
    return <LoadingSpinner message="Loading analysis results..." />;
  }

  // Show error if results failed to load (but not for 409 errors)
  if (resultsError && (resultsError as any).status !== 409) {
    return (
      <ErrorMessage
        error={resultsError}
        onRetry={() => {
          if (analysisId) {
            fetchResults(analysisId);
          } else if (jobStatus && (jobStatus.id || jobStatus.job_id)) {
            fetchResults(jobStatus.id || jobStatus.job_id);
          }
        }}
      />
    );
  }

  // Show job error if no results available
  if (jobError && !results) {
    return (
      <ErrorMessage
        error={jobError}
        onRetry={refreshStatus}
      />
    );
  }

  // No results available
  if (!results) {
    return (
      <Card title="Analysis Results">
        <p>No analysis results available yet.</p>
      </Card>
    );
  }

  // Render complete results
  return (
    <div className="analysis-results">
      {/* Analysis Info */}
      <Card title="Analysis Complete">
        <div className="analysis-info">
          <div className="info-section">
            <div className="info-row">
              <span>Analysis ID:</span>
              <span>{results.id}</span>
            </div>
            <div className="info-row">
              <span>Completed:</span>
              <span>{results.completed_at ? new Date(results.completed_at).toLocaleString() : 'N/A'}</span>
            </div>
            <div className="info-row">
              <span>Status:</span>
              <span className={`status ${getStatusClass(results.status)}`}>
                {STATUS_LABELS[results.status] || results.status}
              </span>
            </div>
          </div>

          <div className="analysis-actions">
            <Button
              onClick={handleDownloadMarkdown}
              variant="secondary"
              title="Download results as a Markdown file"
            >
              📄 Download Markdown
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary */}
      {results.summary && (
        <Summary summary={results.summary} />
      )}

      {/* Key Takeaways */}
      <KeyTakeaways takeaways={results.takeaways} />

      {/* Fact Check Results */}
      <FactCheckTable factChecks={results.fact_checks} />
    </div>
  );
};

export default AnalysisResults;
