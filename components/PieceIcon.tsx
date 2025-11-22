import React from 'react';
import { Color, PieceSymbol } from 'chess.js';

interface PieceIconProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

const PieceIcon: React.FC<PieceIconProps> = ({ type, color, className }) => {
  const isWhite = color === 'w';
  // Theme colors: White pieces are white/cream, Black pieces are dark charcoal
  const fill = isWhite ? "#ffffff" : "#1a1a1a"; 
  const stroke = isWhite ? "#1a1a1a" : "#ffffff"; 
  
  // Accent colors for panda theme elements if needed, but keeping it strict to chess colors for clarity
  // We will use fill/stroke primarily.

  const pieces: Record<string, React.ReactNode> = {
    // Pawn: The Panda Face
    p: (
      <g>
        {/* Ears */}
        <circle cx="12" cy="12" r="5" fill={stroke} />
        <circle cx="33" cy="12" r="5" fill={stroke} />
        {/* Head */}
        <circle cx="22.5" cy="24" r="14" fill={fill} stroke={stroke} strokeWidth="2" />
        {/* Eye Patches */}
        <ellipse cx="16" cy="22" rx="4" ry="5" rotate="-30" fill={stroke} />
        <ellipse cx="29" cy="22" rx="4" ry="5" rotate="30" fill={stroke} />
        {/* Eyes */}
        <circle cx="16" cy="21" r="1.5" fill={isWhite ? '#fff' : '#000'} />
        <circle cx="29" cy="21" r="1.5" fill={isWhite ? '#fff' : '#000'} />
        {/* Nose */}
        <ellipse cx="22.5" cy="28" rx="2.5" ry="1.5" fill={stroke} />
      </g>
    ),
    // Rook: Bamboo Pagoda
    r: (
      <g>
        <path d="M10 38h25" stroke={stroke} strokeWidth="3" strokeLinecap="round"/>
        <rect x="13" y="24" width="19" height="14" fill={fill} stroke={stroke} strokeWidth="2" />
        {/* Roof layers */}
        <path d="M9 24h27l-3-6H12z" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M12 18h21l-3-6H15z" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M15 12h15l-3-4H18z" fill={fill} stroke={stroke} strokeWidth="2" />
        {/* Door */}
        <path d="M20 38v-8h5v8" fill={stroke} />
      </g>
    ),
    // Knight: Horse Head (Dynamic)
    n: (
      <g>
        <path 
            d="M13,36 L33,36 L36,14 C36,14 36,9 32,6 C28,3 21,4 19,7 C16,5 11,6 10,12 C9,15 13,17 14,18 C12,21 11,26 13,36 Z" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth="2" 
            strokeLinejoin="round"
        />
        {/* Mane details */}
        <path d="M31 7c2 2 4 6 4 9" stroke={stroke} strokeWidth="2" fill="none" />
        <path d="M28 6c1 1 2 3 2 5" stroke={stroke} strokeWidth="1.5" fill="none" />
        {/* Eye */}
        <circle cx="22" cy="13" r="1.5" fill={stroke} />
        {/* Snout */}
        <path d="M14 18c-2 1-3 4-1 6" stroke={stroke} strokeWidth="1.5" fill="none" />
      </g>
    ),
    // Bishop: Lotus / Mitre
    b: (
      <g>
        <path d="M22.5 9c-4 0-8 4-8 10 0 8 8 17 8 17s8-9 8-17c0-6-4-10-8-10z" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M22.5 9v27" stroke={stroke} strokeWidth="1.5" />
        <path d="M14.5 19c0 0 4-3 8-3s8 3 8 3" stroke={stroke} strokeWidth="1.5" fill="none" />
        <circle cx="22.5" cy="6" r="3" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M16 38h13" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
    // Queen: Elegant Crown
    q: (
      <g>
        {/* Base */}
        <path d="M12 34h21l-2 4H14z" fill={fill} stroke={stroke} strokeWidth="2" />
        {/* Crown body */}
        <path d="M10 34L8 12l7 8 7.5-10 7.5 10 7-8-2 22H10z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        {/* Jewels */}
        <circle cx="8" cy="12" r="2" fill={stroke} />
        <circle cx="22.5" cy="10" r="2" fill={stroke} />
        <circle cx="37" cy="12" r="2" fill={stroke} />
        <circle cx="15" cy="20" r="1.5" fill={stroke} />
        <circle cx="30" cy="20" r="1.5" fill={stroke} />
      </g>
    ),
    // King: Imperial Crown (Just a crown as requested)
    k: (
      <g>
        {/* Base */}
        <path d="M13 33h19v4H13z" fill={fill} stroke={stroke} strokeWidth="2" />
        {/* Arches */}
        <path d="M13 33c0-12 6-20 9.5-20 3.5 0 9.5 8 9.5 20" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M22.5 13v20" stroke={stroke} strokeWidth="1.5" />
        <path d="M13 33h19" stroke={stroke} strokeWidth="2" />
        {/* Cross/Top */}
        <path d="M22.5 7v6M19.5 10h6" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  };

  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      style={{ 
        filter: isWhite 
          ? 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' 
          : 'drop-shadow(0px 2px 2px rgba(255,255,255,0.2))' 
      }}
    >
      {pieces[type]}
    </svg>
  );
};

export default PieceIcon;