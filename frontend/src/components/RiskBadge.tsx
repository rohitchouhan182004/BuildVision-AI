import React from 'react';
import { SeverityLevel } from '../types';

interface RiskBadgeProps {
  level: SeverityLevel | string;
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const norm = (level || 'LOW').toUpperCase();
  let badgeClass = 'badge-low';
  
  if (norm === 'CRITICAL') {
    badgeClass = 'badge-critical';
  } else if (norm === 'HIGH') {
    badgeClass = 'badge-high';
  } else if (norm === 'MEDIUM' || norm === 'MODERATE') {
    badgeClass = 'badge-medium';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      {norm} {score !== undefined ? `(${score}/100)` : ''}
    </span>
  );
};

