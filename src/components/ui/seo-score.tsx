'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SeoScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SeoScore({ score, size = 'md', className }: SeoScoreProps) {
  const radius = size === 'sm' ? 28 : size === 'md' ? 56 : 84;
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 8 : 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e'; // green-500
    if (score >= 70) return '#eab308'; // yellow-500
    if (score >= 50) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const textSizes = {
    sm: '14px',
    md: '30px', 
    lg: '48px'
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg className={sizeClasses[size]} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        {/* Progress circle */}
        <motion.circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          transform={`rotate(-90 ${radius} ${radius})`}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Perfectly centered text */}
        <text
          x={radius}
          y={radius}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bold font-sans"
          style={{ 
            fontSize: textSizes[size],
            fill: getScoreColor(score),
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          {score}
        </text>
      </svg>
      {size !== 'sm' && (
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <span className="text-xs font-medium text-muted-foreground">
            {getScoreLabel(score)}
          </span>
        </motion.div>
      )}
    </div>
  );
}