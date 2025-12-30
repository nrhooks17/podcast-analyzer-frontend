/**
 * Reusable Card component for content layout.
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  ...props 
}) => {
  const classes = ['card', className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {title && (
        <div className="card-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;