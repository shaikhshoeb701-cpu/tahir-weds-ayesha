import React from 'react';

/** Hanging fanoos lantern with a flickering flame */
export const Lantern: React.FC<{ size?: number; chain?: number; color?: string; className?: string; style?: React.CSSProperties }> = ({
  size = 44,
  chain = 60,
  color = '#C9A24A',
  className = '',
  style,
}) => (
  <div className={`lantern-swing pointer-events-none ${className}`} style={style} aria-hidden="true">
    <svg width={size} height={chain + size * 2.1} viewBox={`0 0 40 ${chain / (size / 40) + 84}`} style={{ display: 'block' }}>
      {(() => {
        const c = chain / (size / 40);
        return (
          <g>
            <line x1="20" y1="0" x2="20" y2={c} stroke={color} strokeWidth="1" strokeDasharray="3 2" />
            <g transform={`translate(0 ${c})`}>
              <circle cx="20" cy="3" r="2.6" fill="none" stroke={color} strokeWidth="1.2" />
              <path d="M20 5 L20 9" stroke={color} strokeWidth="1.2" />
              <path d="M9 22 Q20 4 31 22 Z" fill={color} />
              <rect x="7" y="22" width="26" height="3" rx="1.2" fill={color} />
              <path d="M9 25 L9 55 Q20 63 31 55 L31 25" fill="rgba(255,236,190,0.18)" stroke={color} strokeWidth="1.6" />
              <path d="M15 25 L15 57 M25 25 L25 57" stroke={color} strokeWidth="0.9" />
              <path d="M9 33 Q20 27 31 33" fill="none" stroke={color} strokeWidth="0.9" />
              <path d="M12 27 Q20 22 28 27 L28 52 Q20 58 12 52 Z" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />
              <ellipse className="lantern-flame" cx="20" cy="43" rx="5" ry="8" fill="#FFD27A" />
              <ellipse className="lantern-flame" cx="20" cy="45" rx="2.2" ry="4" fill="#FFF3D1" />
              <path d="M7 56 L33 56 L28 64 L12 64 Z" fill={color} />
              <path d="M20 64 L20 74" stroke={color} strokeWidth="1.2" />
              <path d="M17 74 L23 74 L20 82 Z" fill={color} />
            </g>
          </g>
        );
      })()}
    </svg>
  </div>
);

/** Crescent moon with a star */
export const CrescentStar: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 28, color = '#C9A24A', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path d="M14 4 A12 12 0 0 0 14 28 A14 14 0 0 1 14 4 Z" fill={color} />
    <path
      d="M24 10 l1.1 2.6 2.8 .2 -2.1 1.8 .7 2.7 -2.5 -1.5 -2.5 1.5 .7 -2.7 -2.1 -1.8 2.8 -.2 z"
      fill={color}
    />
  </svg>
);

/** Eight-pointed star (Rub el Hizb style) */
export const Star8: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 18, color = '#C9A24A', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect x="5" y="5" width="14" height="14" fill="none" stroke={color} strokeWidth="1.4" />
    <rect x="5" y="5" width="14" height="14" fill="none" stroke={color} strokeWidth="1.4" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="2.2" fill={color} />
  </svg>
);

/** Gold ornamental divider with a central star */
export const OrnateDivider: React.FC<{ color?: string; className?: string }> = ({ color = '#C9A24A', className = '' }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
    <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: color }} />
    <Star8 size={20} color={color} />
    <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: color }} />
    <span className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
  </div>
);

/** A Mughal / mehrab arch outline that frames its children */
export const MehrabFrame: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({
  children,
  className = '',
  color = '#C9A24A',
}) => (
  <div className={`relative ${className}`}>
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M6 398 L6 150 C6 90 60 60 110 40 C130 32 142 20 150 4 C158 20 170 32 190 40 C240 60 294 90 294 150 L294 398"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M16 398 L16 154 C16 100 66 72 114 52 C134 44 144 34 150 22 C156 34 166 44 186 52 C234 72 284 100 284 154 L284 398"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        strokeDasharray="3 4"
        vectorEffect="non-scaling-stroke"
        opacity="0.8"
      />
    </svg>
    <div className="relative">{children}</div>
  </div>
);
