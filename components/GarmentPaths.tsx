
import React from 'react';

export const TshirtSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
    <path 
      d="M100 100 L150 70 C180 50 320 50 350 70 L400 100 L450 180 L380 220 L350 180 L350 450 L150 450 L150 180 L120 220 L50 180 Z" 
      fill={color} 
      stroke="#333" 
      strokeWidth="2"
    />
    {/* Detail lines */}
    <path d="M150 180 L150 450" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
    <path d="M350 180 L350 450" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
    <path d="M180 65 Q250 100 320 65" stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none" />
  </svg>
);

export const HoodieSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
    <path 
      d="M100 100 L150 50 C200 20 300 20 350 50 L400 100 L450 180 L380 220 L350 180 L350 450 L150 450 L150 180 L120 220 L50 180 Z" 
      fill={color} 
      stroke="#333" 
      strokeWidth="2"
    />
    {/* Hood */}
    <path d="M150 180 Q250 150 350 180" stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none" />
    <path d="M180 55 Q250 80 320 55" stroke="rgba(0,0,0,0.3)" strokeWidth="3" fill="none" />
    {/* Pocket */}
    <path d="M180 320 L320 320 L340 380 L160 380 Z" fill="rgba(0,0,0,0.05)" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    {/* Strings */}
    <path d="M220 180 L220 240" stroke="#555" strokeWidth="3" strokeLinecap="round" />
    <path d="M280 180 L280 240" stroke="#555" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
