import React from 'react';

interface RadialGaugeProps {
  score: number; // 0-100
}

const scoreCategory = (score: number): { label: string; color: string } => {
  if (score <= 30) return { label: 'Low', color: '#34D399' }; // Tailwind green-500
  if (score <= 60) return { label: 'Moderate', color: '#FBBF24' }; // Tailwind yellow-500
  if (score <= 80) return { label: 'High', color: '#F59E0B' }; // Tailwind amber-500
  return { label: 'Critical', color: '#EF4444' }; // Tailwind red-500
};

const RadialGauge: React.FC<RadialGaugeProps> = ({ score }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const { label, color: activeColor } = scoreCategory(clampedScore);
  const radius = 80;
  const strokeWidth = 16;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const offset = circumference - (clampedScore / 100) * circumference;

  const gaugeBackgroundColor = '#E5E7EB'; // Tailwind gray-200
  const darkGaugeBackgroundColor = '#4B5563'; // Tailwind gray-600

  return (
    <div className="flex flex-col items-center relative">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r={innerRadius}
          strokeWidth={strokeWidth}
          transform="rotate(-90 100 100)"
          fill="transparent"
          className="stroke-current text-gray-200 dark:text-gray-600"
        />
        {/* Foreground Arc */}
        <circle
          cx="100"
          cy="100"
          r={innerRadius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ stroke: activeColor, transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' }}
        />
        {/* Text in the center */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          dy="-0.5em"
          className="text-4xl font-bold fill-current"
          style={{ fill: activeColor, transition: 'fill 0.5s ease-out' }}
        >
          {clampedScore}
        </text>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          dy="1.0em"
          className="text-lg font-medium fill-current"
          style={{ fill: activeColor, transition: 'fill 0.5s ease-out' }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

export default RadialGauge; 