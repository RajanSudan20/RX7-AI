import React from 'react';

interface Rx7LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function Rx7Logo({ size = 'md', showTagline = false, className = '' }: Rx7LogoProps) {
  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48',
  };

  const svgDimensions = {
    sm: 32,
    md: 40,
    lg: 96,
    xl: 192,
  };

  const dim = svgDimensions[size];

  return (
    <div className={`relative flex flex-col items-center justify-center shrink-0 ${className}`}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_20px_rgba(255,32,64,0.25)]"
      >
        <defs>
          {/* Copper Rose-Gold Metallic Gradient */}
          <linearGradient id="rx7CopperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5B29D" />
            <stop offset="45%" stopColor="#D88A72" />
            <stop offset="100%" stopColor="#A85A43" />
          </linearGradient>

          {/* Dark Metallic Background Gradient */}
          <linearGradient id="rx7DarkBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B0E17" />
            <stop offset="50%" stopColor="#101522" />
            <stop offset="100%" stopColor="#080A10" />
          </linearGradient>

          {/* Red Laser Glow Filter */}
          <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Frame with Subtle Border */}
        <rect
          x="2"
          y="2"
          width="196"
          height="196"
          rx="24"
          fill="url(#rx7DarkBg)"
          stroke="#1E2638"
          strokeWidth="2"
        />

        {/* Subtle Background Mesh Texture Grid */}
        <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#FFFFFF" fillOpacity="0.03" />
        </pattern>
        <rect x="2" y="2" width="196" height="196" rx="24" fill="url(#gridPattern)" />

        {/* Top Geometric Chevron Lines & Red Laser Light */}
        <path d="M 10 30 L 100 70 L 190 30" stroke="#1A2234" strokeWidth="6" strokeLinecap="round" />
        <path d="M 10 10 L 100 50 L 190 10" stroke="#253046" strokeWidth="4" />
        {/* Red Laser Beams Top */}
        <path d="M 10 10 L 100 50 L 190 10" stroke="#FF2040" strokeWidth="2" filter="url(#redGlow)" opacity="0.9" />
        <circle cx="100" cy="50" r="5" fill="#FF2040" filter="url(#redGlow)" />
        <circle cx="100" cy="50" r="2" fill="#FFFFFF" />

        {/* Bottom Geometric Chevron Lines & Red Laser Light */}
        <path d="M 10 170 L 100 130 L 190 170" stroke="#1A2234" strokeWidth="6" strokeLinecap="round" />
        <path d="M 10 190 L 100 150 L 190 190" stroke="#253046" strokeWidth="4" />
        {/* Red Laser Beams Bottom */}
        <path d="M 10 190 L 100 150 L 190 190" stroke="#FF2040" strokeWidth="2" filter="url(#redGlow)" opacity="0.9" />
        <circle cx="100" cy="150" r="5" fill="#FF2040" filter="url(#redGlow)" />
        <circle cx="100" cy="150" r="2" fill="#FFFFFF" />

        {/* Central Stylized RX7 Metallic Winged Mark */}
        <g>
          {/* Upper Wing Element */}
          <path
            d="M 78 62 L 96 62 L 108 78 L 132 48 L 118 92 L 98 92 Z"
            fill="url(#rx7CopperGrad)"
          />

          {/* Lower Wing Element */}
          <path
            d="M 122 118 L 104 118 L 92 102 L 68 132 L 82 88 L 102 88 Z"
            fill="url(#rx7CopperGrad)"
          />
        </g>

        {/* RX7 Bold Typography */}
        <text
          x="100"
          y="142"
          textAnchor="middle"
          fill="url(#rx7CopperGrad)"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="26"
          letterSpacing="2"
        >
          RX7
        </text>

        {/* REWRITE THE WORLD Tagline */}
        {(showTagline || size === 'lg' || size === 'xl') && (
          <text
            x="100"
            y="162"
            textAnchor="middle"
            fill="#D88A72"
            fillOpacity="0.8"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            fontSize="8"
            letterSpacing="3.5"
          >
            REWRITE THE WORLD
          </text>
        )}
      </svg>
    </div>
  );
}

