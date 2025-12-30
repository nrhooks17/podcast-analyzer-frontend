/**
 * Loading spinner component.
 */

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;