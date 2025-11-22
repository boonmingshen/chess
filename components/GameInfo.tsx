import React from 'react';
import { PieceSymbol, Color } from 'chess.js';
import PieceIcon from './PieceIcon';
import { TimerState } from '../types';

interface GameInfoProps {
  color: Color;
  timer: number;
  captured: PieceSymbol[];
  isActive: boolean;
  orientation: 'white' | 'black';
}

const GameInfo: React.FC<GameInfoProps> = ({ color, timer, captured, isActive, orientation }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isUserPerspective = color === orientation;

  return (
    <div 
      className={`flex items-center justify-between w-full max-w-[600px] p-4 rounded-xl backdrop-blur-md border transition-all duration-500
      ${isActive ? 'bg-slate-800/80 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-900/50 border-slate-700'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${color === 'w' ? 'bg-slate-100 border-slate-300' : 'bg-slate-800 border-slate-600'}`}>
          <span className={`font-bold text-lg ${color === 'w' ? 'text-slate-800' : 'text-slate-100'}`}>
            {color === 'w' ? 'W' : 'B'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            {color === 'w' ? 'White' : 'Black'}
          </span>
          <div className="flex -space-x-2 h-5 mt-1">
            {captured.map((p, i) => (
              <div key={i} className="w-5 h-5 relative transform hover:scale-150 hover:z-10 transition-transform">
                <PieceIcon type={p} color={color === 'w' ? 'b' : 'w'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`font-mono text-3xl font-bold ${isActive ? (timer < 30 ? 'text-red-500 animate-pulse' : 'text-white') : 'text-slate-500'}`}>
        {formatTime(timer)}
      </div>
    </div>
  );
};

export default GameInfo;
