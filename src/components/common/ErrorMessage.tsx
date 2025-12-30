/**
 * Error message component for displaying user-friendly errors.
 */

import React from 'react';
import { ApiError } from '../../types/api';

interface ErrorMessageProps {
  error?: ApiError | null;
  onRetry?: () => void;
  className?: string;
  showDetails?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  className = '',
  showDetails = false 
}) => {
  if (!error) return null;

  const message = error.message || 'An unexpected error occurred';
  const code = error.code;
  const correlationId = error.correlationId;

  return (
    <div className={`error ${className}`}>
      <div className="error-content">
        <h4>Error</h4>
        <p>{message}</p>
        
        {showDetails && (
          <div className="error-details">
            {code && <p><strong>Code:</strong> {code}</p>}
            {correlationId && <p><strong>Reference:</strong> {correlationId}</p>}
          </div>
        )}
        
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;