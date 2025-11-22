export const PIECE_IMAGES: Record<string, string> = {
  w: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Chess_blt45.svg/800px-Chess_blt45.svg.png', // Placeholder fallback logic usually needed
};

// Using standard SVG paths for pieces for cleaner rendering and color control
// We will render SVGs directly in components rather than loading images to allow better styling
export const INITIAL_TIME = 600; // 10 minutes
