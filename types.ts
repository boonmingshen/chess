import { Square, PieceSymbol, Color, Move } from 'chess.js';

export interface GameState {
  fen: string;
  turn: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  winner: Color | null;
  history: string[];
  captured: { w: PieceSymbol[]; b: PieceSymbol[] };
}

export interface TimerState {
  w: number; // seconds
  b: number; // seconds
}

export interface ExplosionData {
  id: string;
  x: number; // 0-7
  y: number; // 0-7
  color: string;
  pieceType: PieceSymbol; // 'p', 'n', 'b', 'r', 'q', 'k'
}

export type BoardOrientation = 'white' | 'black';