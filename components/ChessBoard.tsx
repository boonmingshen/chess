import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color, Move } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import PieceIcon from './PieceIcon';
import Explosion from './Effects/Explosion';
import { ExplosionData, BoardOrientation } from '../types';
import confetti from 'canvas-confetti';
import { Maximize, RotateCcw, Repeat } from 'lucide-react';

interface ChessBoardProps {
  game: Chess;
  setGame: React.Dispatch<React.SetStateAction<Chess>>;
  orientation: BoardOrientation;
  setOrientation: (o: BoardOrientation) => void;
  onMove: (move: Move | null) => void;
  frozen: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ game, setGame, orientation, setOrientation, onMove, frozen }) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [shake, setShake] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);

  // Helper to get board squares in correct order based on orientation
  const getBoardSquares = () => {
    const squares = [];
    for (let r = 0; r < 8; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        // If orientation is white: row 0 is rank 8 (top), row 7 is rank 1 (bottom)
        // If orientation is black: row 0 is rank 1 (top), row 7 is rank 8 (bottom)
        const rankIndex = orientation === 'white' ? 7 - r : r;
        const fileIndex = orientation === 'white' ? c : 7 - c;
        
        const file = "abcdefgh"[fileIndex];
        const rank = rankIndex + 1;
        const square = `${file}${rank}` as Square;
        row.push(square);
      }
      squares.push(row);
    }
    return squares;
  };

  const squares = getBoardSquares();

  const handleSquareClick = (square: Square) => {
    if (frozen) return;

    // If selecting a piece to move
    if (selectedSquare === null) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setValidMoves(moves.map(m => m.to));
      }
      return;
    }

    // If clicking the same square, deselect
    if (square === selectedSquare) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Attempt move
    try {
      const moveAttempt = {
        from: selectedSquare,
        to: square,
        promotion: 'q', // Always promote to queen for simplicity in this UI
      };

      // Check what piece is moving BEFORE the move happens
      const movingPiece = game.get(selectedSquare);
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(moveAttempt);

      if (result) {
        // Check for capture to trigger effect
        if (result.captured) {
            const fileIndex = "abcdefgh".indexOf(result.to[0]);
            const rankIndex = parseInt(result.to[1]) - 1;
            
            const x = orientation === 'white' ? fileIndex : 7 - fileIndex;
            const y = orientation === 'white' ? 7 - rankIndex : rankIndex;

            // Determine explosion color based on CAPTURED piece color
            const explosionColor = result.color === 'w' ? '#0f172a' : '#f8fafc'; 
            
            // The Piece that DID the capturing is 'result.piece'
            const pieceType = result.piece; 

            setExplosions(prev => [...prev, { 
                id: Date.now().toString(), 
                x, 
                y,
                color: explosionColor,
                pieceType: pieceType
            }]);

            // Trigger Board Shake
            setShake(prev => prev + 1);
        }

        // Update real game state
        game.move(moveAttempt);
        setGame(new Chess(game.fen()));
        setLastMove(result);
        onMove(result);
        
        // Reset selection
        setSelectedSquare(null);
        setValidMoves([]);

        // Win celebration
        if (game.isCheckmate()) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#ffffff', '#000000'] // Panda theme confetti
            });
        }
      } else {
        // Invalid move, but maybe selecting a different friendly piece?
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
            const moves = game.moves({ square, verbose: true }) as Move[];
            setValidMoves(moves.map(m => m.to));
        } else {
            setSelectedSquare(null);
            setValidMoves([]);
        }
      }
    } catch (e) {
      console.error(e);
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const isSquareDark = (square: Square) => {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    return (file + rank) % 2 === 0;
  };

  return (
    <motion.div 
      animate={shake > 0 ? { x: [0, -5, 5, -5, 5, 0], rotate: [0, -1, 1, -1, 1, 0] } : {}}
      transition={{ duration: 0.4 }}
      key={shake} // Remount animation on change
      className="relative w-full max-w-[600px] aspect-square select-none p-2 rounded-xl bg-[#2e3d30] shadow-2xl ring-4 ring-[#1e2b1f]"
    >
      {/* Board Grid */}
      <div 
        ref={boardRef}
        className="w-full h-full grid grid-rows-8 grid-cols-8 rounded-lg overflow-hidden relative border-2 border-[#1e2b1f]"
      >
        {squares.map((row, rowIndex) => (
          row.map((square, colIndex) => {
            const piece = game.get(square);
            const isDark = isSquareDark(square);
            const isSelected = selectedSquare === square;
            const isValidMove = validMoves.includes(square);
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const inCheck = piece?.type === 'k' && piece.color === game.turn() && game.inCheck();

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`
                  relative w-full h-full flex items-center justify-center
                  ${isDark ? 'bg-[#78967a]' : 'bg-[#e8efe9]'} 
                  ${isSelected ? '!bg-yellow-400/60 ring-inset ring-4 ring-yellow-500' : ''}
                  ${(isLastMoveFrom || isLastMoveTo) && !isSelected ? 'bg-green-400/40' : ''}
                  ${inCheck ? 'bg-red-500/50 animate-pulse' : ''}
                  cursor-pointer transition-colors duration-150
                `}
              >
                {/* Rank/File Labels */}
                {colIndex === 0 && (
                   <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${isDark ? 'text-[#2e3d30]' : 'text-[#78967a]'}`}>
                     {square[1]}
                   </span>
                )}
                {rowIndex === 7 && (
                   <span className={`absolute bottom-0 right-0.5 text-[10px] font-bold ${isDark ? 'text-[#2e3d30]' : 'text-[#78967a]'}`}>
                     {square[0]}
                   </span>
                )}

                {/* Valid Move Indicator */}
                {isValidMove && (
                  <div className={`absolute z-10 w-3 h-3 rounded-full ${piece ? 'ring-4 ring-[#2e3d30]/40 w-full h-full rounded-none opacity-30 bg-[#2e3d30]' : 'bg-[#2e3d30]/20'}`} />
                )}

                {/* Piece */}
                <AnimatePresence>
                  {piece && (
                    <motion.div
                        key={`${square}-${piece.type}-${piece.color}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }} 
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full h-full z-20 relative p-0.5"
                    >
                      <PieceIcon type={piece.type} color={piece.color} className="w-full h-full" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Explosions */}
                {explosions.filter(e => e.y === rowIndex && e.x === colIndex).map(e => (
                    <Explosion 
                        key={e.id} 
                        x={0} y={0} 
                        color={e.color} 
                        pieceType={e.pieceType}
                        onComplete={() => setExplosions(prev => prev.filter(ex => ex.id !== e.id))} 
                    />
                ))}

              </div>
            );
          })
        ))}
      </div>
    </motion.div>
  );
};

export default ChessBoard;