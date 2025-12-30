/**
 * Component for displaying podcast summary.
 */

import React from 'react';
import Card from '../common/Card';

interface SummaryProps {
  summary: string;
  className?: string;
}

const Summary: React.FC<SummaryProps> = ({ summary, className = '' }) => {
  if (!summary) return null;

  return (
    <Card title="Summary" className={className}>
      <div className="summary-content">
        <p>{summary}</p>
      </div>
    </Card>
  );
};

export default Summary;