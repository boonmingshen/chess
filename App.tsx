import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Move, Color } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import { TimerState, BoardOrientation, GameState } from './types';
import { INITIAL_TIME } from './constants';
import { RefreshCw, RotateCcw, Trophy, Crown } from 'lucide-react';

// Helper to calculate captured pieces
const getCapturedPieces = (fen: string) => {
  const chess = new Chess(fen);
  const history = chess.history({ verbose: true }) as Move[];
  const capturedW = [];
  const capturedB = [];
  
  for (const move of history) {
    if (move.captured) {
      if (move.color === 'w') {
        capturedB.push(move.captured); // White captured Black's piece
      } else {
        capturedW.push(move.captured); // Black captured White's piece
      }
    }
  }
  return { w: capturedW, b: capturedB };
};

function App() {
  const [game, setGame] = useState(new Chess());
  const [orientation, setOrientation] = useState<BoardOrientation>('white');
  const [timer, setTimer] = useState<TimerState>({ w: INITIAL_TIME, b: INITIAL_TIME });
  const [gameStatus, setGameStatus] = useState<'active' | 'white_won' | 'black_won' | 'draw'>('active');
  const [captured, setCaptured] = useState<{ w: any[], b: any[] }>({ w: [], b: [] });
  
  // Auto-Flip toggle
  const [autoFlip, setAutoFlip] = useState(true);

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStatus === 'active') {
      interval = setInterval(() => {
        setTimer(prev => {
          const turn = game.turn();
          if (turn === 'w') {
             if (prev.w <= 0) {
                setGameStatus('black_won');
                return prev;
             }
             return { ...prev, w: prev.w - 1 };
          } else {
             if (prev.b <= 0) {
                setGameStatus('white_won');
                return prev;
             }
             return { ...prev, b: prev.b - 1 };
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [game, gameStatus]);

  const handleMove = (move: Move | null) => {
    if (!move) return;

    // Check Game Over
    if (game.isCheckmate()) {
      setGameStatus(game.turn() === 'w' ? 'black_won' : 'white_won');
    } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
      setGameStatus('draw');
    }

    // Update captured pieces
    if (move.captured) {
        const caps = getCapturedPieces(game.fen());
        setCaptured(caps);
    }

    // Auto Flip
    if (autoFlip && gameStatus === 'active' && !game.isGameOver()) {
      const nextTurn = game.turn();
      const nextOrientation = nextTurn === 'w' ? 'white' : 'black';
      
      // Add a small delay for better UX so the move completes visually before flipping
      setTimeout(() => {
          setOrientation(nextOrientation);
      }, 600);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setTimer({ w: INITIAL_TIME, b: INITIAL_TIME });
    setGameStatus('active');
    setCaptured({ w: [], b: [] });
    setOrientation('white');
  };

  return (
    <div className="min-h-screen bg-[#1a1f1a] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
        
        {/* Background Ambient Effects - Bamboo Forest Vibes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-green-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#2e3d30]/40 rounded-full blur-[120px]" />
        </div>

        {/* Header */}
        <header className="z-10 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
                 {/* Panda Icon (Simple Representation) */}
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-black flex items-center justify-center relative shadow-lg">
                     <div className="absolute -top-2 -left-1 w-4 h-4 bg-black rounded-full" />
                     <div className="absolute -top-2 -right-1 w-4 h-4 bg-black rounded-full" />
                     <div className="w-8 h-6 bg-black rounded-full mt-2 relative">
                         <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                         <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
                     </div>
                 </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 tracking-tight drop-shadow-lg">
                BAO CHESS
            </h1>
            <p className="text-green-400/60 mt-1 font-medium tracking-wide uppercase text-xs md:text-sm">
                Strategy in Black & White
            </p>
        </header>

        {/* Game Container */}
        <main className="z-10 flex flex-col items-center gap-4 w-full max-w-4xl">
            
            {/* Top Player Info (Opponent) */}
            <GameInfo 
                color={orientation === 'white' ? 'b' : 'w'} 
                timer={orientation === 'white' ? timer.b : timer.w}
                captured={orientation === 'white' ? captured.w : captured.b}
                isActive={game.turn() === (orientation === 'white' ? 'b' : 'w')}
                orientation={orientation}
            />

            {/* The Board - Auto rotating container */}
            <div 
                className="transition-transform duration-700 ease-in-out my-2"
            >
                <ChessBoard 
                    game={game} 
                    setGame={setGame} 
                    orientation={orientation} 
                    setOrientation={setOrientation}
                    onMove={handleMove}
                    frozen={gameStatus !== 'active'}
                />
            </div>

            {/* Bottom Player Info (You) */}
            <GameInfo 
                color={orientation} 
                timer={orientation === 'white' ? timer.w : timer.b}
                captured={orientation === 'white' ? captured.b : captured.w}
                isActive={game.turn() === orientation}
                orientation={orientation}
            />

            {/* Controls */}
            <div className="flex gap-4 mt-6">
                <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-[#2e3d30] hover:bg-[#3e4f40] text-green-100 rounded-xl font-bold transition-all active:scale-95 shadow-lg border border-[#4a614d]"
                >
                    <RotateCcw size={20} />
                    Restart Match
                </button>
                <button 
                    onClick={() => setAutoFlip(!autoFlip)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg border ${
                        autoFlip 
                        ? 'bg-green-600 hover:bg-green-500 text-white border-green-400' 
                        : 'bg-[#2e3d30] hover:bg-[#3e4f40] text-green-100/50 border-[#4a614d]'
                    }`}
                >
                    <RefreshCw size={20} className={autoFlip ? 'animate-spin-slow' : ''} />
                    Auto-Flip: {autoFlip ? 'ON' : 'OFF'}
                </button>
            </div>

            {/* Game Over Modal */}
            {gameStatus !== 'active' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#1a1f1a] p-10 rounded-3xl border-4 border-green-800/50 shadow-2xl text-center max-w-sm w-full mx-4 transform scale-100 animate-in zoom-in-95 duration-200">
                        <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
                        <h2 className="text-4xl font-black text-green-100 mb-2">
                            {gameStatus === 'draw' ? 'DRAW' : (gameStatus === 'white_won' ? 'WHITE WINS' : 'BLACK WINS')}
                        </h2>
                        <p className="text-green-400/60 mb-8 uppercase tracking-widest text-sm">
                            {gameStatus === 'draw' ? 'Stalemate or Repetition' : 'Victory Achieved'}
                        </p>
                        <button 
                            onClick={resetGame}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            )}

        </main>
    </div>
  );
}

export default App;