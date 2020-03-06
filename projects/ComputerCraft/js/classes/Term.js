class Term {
  constructor() {
    this.cursor = new Cursor();

    this.createBuffer();
    this.writeBufferStartLine();
  }

  createBuffer() {
    this.buffer = [];

    for (let col = 0; col < charCols; col++) {
      this.buffer[col] = [];
    }
  }

  update() {
    this.showBuffer();
    this.cursor.update();
  }

  writeBufferStartLine() {
    const cursor = this.cursor;
    const startX = cursor.startX;
    const y = cursor.y;
    const char1 = 62; // '>'
    const char2 = 32; // ' '
    const buffer = this.buffer;

    buffer[startX][y] = char1;
    buffer[startX + 1][cursor.y] = char2;
  }

  showBuffer() {
    for (let row = 0; row < charRows; row++) {
      for (let col = 0; col < charCols; col++) {
        const val = this.buffer[col][row];
        const x = col * charSize.w + leftOffset;
        const y = row * charSize.h + topOffset;

        if (val) {
          image(chars[val], x, y);
        }
      }
    }
  }

  enter() {
    const cursor = this.cursor;
    const typing = cursor.typing;
    const len = typing.length;
    const start = cursor.endX;
    const end = charCols - 1;

    for (let i = start; i < end; i++) {
      const typingIndex = i - 2;
      const val = typing[typingIndex];
      const x = i;
      const y = cursor.y;

      this.buffer[x][y] = val;
    }

    // Removes the cursor's drawn '_' character from the buffer (or rewrites ' ').
    const x = min(end, start + len);
    const y = cursor.y;

    this.buffer[x][y] = 32; // ' '

    this.reply()

    this.cursor.y++;
    this.writeBufferStartLine();

    this.cursor.typing = [];
  }

  backspace() {
    const cursor = this.cursor;
    const typing = cursor.typing;
    const len = typing.length;
    const x = cursor.endX + len;
    const y = cursor.y;
    const char = 32; // ' '

    // Removes the cursor's drawn '_' character from the buffer (or rewrites ' ').
    this.buffer[x][y] = char;

    typing.pop();
  }

  reply() {
    const cursor = this.cursor;
    const typing = cursor.typing;
    const len = typing.length;

    if (len === 0) {
      return;
    }

    const typingStr = cursor.getTypingStr();

    const response = this.getResponse(typingStr);
    
    this.write(response);
  }
  
  getResponse(string) {
    switch (string) {
      case 'help':
        return 'Sorry, no help info yet!';
      case 'lua':
        return window.helloWorld();
      default:
        return 'No such program';
    }
  }
  
  write(string) {
    this.cursor.y++;
    
    const len = string.length;
    const cursor = this.cursor;
    const xStart = cursor.startX;
    const yStart = cursor.y;

    for (let i = 0; i < len; i++) {
      const str = string[i];
      const val = keys[str];
      const xOffset = i % charCols;
      const yOffset = floor(i / charCols);
      const col = xStart + xOffset;
      const row = yStart + yOffset;

      this.buffer[col][row] = val;
    }

    const end = floor((len - 1) / charCols);

    for (let i = 0; i < end; i++) {
      cursor.y++;
    }
  }
}