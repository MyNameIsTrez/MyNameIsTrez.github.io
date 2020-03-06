const charScale = 3;

const charSize = {
  w: 6 * charScale, // 6 is computercraft font, 8 is monospace for all chars.
  h: 8 * charScale
};

const charCols = 16;
const charRows = 16;

// const charCols = Math.floor(innerWidth / charSize.w) - 1;
// const charRows = Math.floor(innerHeight / charSize.h) - 2;

let keyPressedFrameCount = 0;

const leftOffset = 2 * charScale; // 2 'pixels' at the left are kept empty.
const topOffset = 2 * charScale; // 2 'pixels' at the top are kept empty.
const bottomOffset = 2 * charScale; // 2 'pixels' at the bottom are kept empty. One 'pixel' comes from the bottom character.

const width = charSize.w * charCols + leftOffset;
const height = charSize.h * charRows + topOffset + bottomOffset;

let defaultImg; // Comes from 'preload()'.
let term;

const chars = [];