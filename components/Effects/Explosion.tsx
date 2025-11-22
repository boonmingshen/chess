import React from 'react';
import { motion } from 'framer-motion';
import { PieceSymbol } from 'chess.js';

interface ExplosionProps {
  x: number;
  y: number;
  color: string;
  pieceType: PieceSymbol;
  onComplete: () => void;
}

const Explosion: React.FC<ExplosionProps> = ({ x, y, color, pieceType, onComplete }) => {
  
  // -- PAWN (Panda): Bamboo Splash --
  if (pieceType === 'p') {
    const sticks = [0, 45, 90, 135, 180, 225, 270, 315];
    return (
      <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
        {sticks.map((angle, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: angle }}
            animate={{ opacity: 0, x: Math.cos(angle * Math.PI / 180) * 40, y: Math.sin(angle * Math.PI / 180) * 40, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={i === 0 ? onComplete : undefined}
            className="absolute w-2 h-8 bg-green-500 rounded-full"
            style={{ boxShadow: '0 0 5px #22c55e' }}
          />
        ))}
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1.5, opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="absolute w-full h-full bg-green-200/30 rounded-full"
        />
      </div>
    );
  }

  // -- KNIGHT (Horse): Kick / Stomp --
  if (pieceType === 'n') {
    return (
      <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
        {/* Impact Crater */}
        <motion.div
          initial={{ scale: 0, opacity: 1, borderWidth: 0 }}
          animate={{ scale: 2.5, opacity: 0, borderWidth: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onAnimationComplete={onComplete}
          className="absolute rounded-full border-amber-700/50"
          style={{ width: '100%', height: '100%' }}
        />
        {/* Dust Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 1 }}
                animate={{ 
                    x: (Math.random() - 0.5) * 80, 
                    y: (Math.random() - 0.5) * 80, 
                    scale: 0,
                    opacity: 0
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-3 h-3 bg-stone-500 rounded-full blur-sm"
            />
        ))}
      </div>
    );
  }

  // -- ROOK: Crush / Smash --
  if (pieceType === 'r') {
    return (
       <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
         <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="absolute w-full h-full bg-slate-200/50"
         />
         <motion.div
            initial={{ width: '10%', height: '10%', opacity: 1 }}
            animate={{ width: '150%', height: '150%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onAnimationComplete={onComplete}
            className="absolute border-4 border-slate-400"
         />
       </div>
    );
  }

  // -- BISHOP: Slice --
  if (pieceType === 'b') {
      return (
        <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
            <motion.div
                initial={{ rotate: 45, scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 2, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={onComplete}
                className="absolute w-24 h-1 bg-blue-400 shadow-[0_0_10px_#60a5fa]"
            />
            <motion.div
                initial={{ rotate: -45, scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 2, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="absolute w-24 h-1 bg-blue-400 shadow-[0_0_10px_#60a5fa]"
            />
        </div>
      );
  }

  // -- QUEEN: Royal Blast --
  if (pieceType === 'q') {
      return (
        <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 3, rotate: 180, opacity: 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={onComplete}
                className="absolute w-full h-full border-4 border-purple-500 rounded-full border-dashed"
            />
             <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full h-full bg-purple-500/30 rounded-full blur-md"
            />
        </div>
      );
  }

  // -- KING: Golden Command --
  if (pieceType === 'k') {
    return (
        <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={onComplete}
                className="absolute w-full h-full border-2 border-yellow-400 rounded-full shadow-[0_0_15px_#facc15]"
            />
            <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute w-full h-full border-2 border-yellow-200 rounded-full"
            />
        </div>
      );
  }

  // -- FALLBACK (Standard Explosion) --
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute pointer-events-none z-50 w-full h-full top-0 left-0 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(angle * (Math.PI / 180)) * 50,
              y: Math.sin(angle * (Math.PI / 180)) * 50,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={i === 0 ? onComplete : undefined}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
};

export default Explosion;