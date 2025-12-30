/**
 * Progress bar component for showing upload/processing progress.
 */

import React from 'react';

type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
  variant?: ProgressBarVariant;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  showLabel = true, 
  className = '',
  variant = 'primary'
}) => {
  const percentage = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={`progress ${className}`}>
      <div 
        className={`progress-bar progress-bar-${variant}`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {showLabel && <span>{percentage}%</span>}
      </div>
    </div>
  );
};

export default ProgressBar;