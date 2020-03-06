class Cursor {
  constructor() {
    this.startX = 0;
    this.endX = 2;
    this.y = 0;

    this.typing = [];
    this.cursorRefresh = 2 / 3; // In seconds.
  }

  update() {
    this.showLineText();
    this.showCursorFlickering();
  }

  showCursorFlickering() {
    const len = this.typing.length;
    const maximum = charCols - this.endX - 1;
    const col = this.endX + min(maximum, len);
    const row = this.y;
    const n = 60 * this.cursorRefresh;
    const char1 = 32; // ' '
    const char2 = 95; // '_'

    if (frameCount % n < n / 2) {
      term.buffer[col][row] = char1;
    } else {
      term.buffer[col][row] = char2;
    }
  }

  showLineText() {
    const row = this.y;
    const a = this.endX + this.typing.length - charCols + 1;
    const minimum = 0;
    const start = max(minimum, a);
    const end = this.typing.length;

    for (let i = start; i < end; i++) {
      const charCode = this.typing[i];
      const col = this.endX - start + i;

      term.buffer[col][row] = charCode;
    }
  }

  getTypingStr() {
    const cursor = term.cursor;
    const typing = cursor.typing;
    const len = typing.length;
    let str = '';

    for (const val of typing) {
      str += getKeyByValue(keys, val);
    }

    return str;
  }
}