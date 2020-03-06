function createChars() {
  defaultImg.loadPixels();

  // every 8*8 pixels in defaultImg is a char
  // defaultImg contains 16*16 chars
  for (let a = 0; a < 16; a++) {
    for (let b = 0; b < 16; b++) {
      createChar(a, b);
    }
  }
}

function createChar(a, b) {
  const charImg = createImage(charSize.w, charSize.h);
  
  charImg.loadPixels();

  // Splits defaultImg up into 256 characters.
  // The characters are resized by the charScale.
  for (let c = 0; c < charSize.h / charScale; c++) {
    for (let d = 0; d < charSize.w / charScale; d++) {
      const defaultImgIndex = (d + c * 128 + b * 8 + a * 8 * 128) * 4;
      const charImgIndex = (d * charScale + c * charSize.w * charScale) * 4;

      for (let e = 0; e < charScale; e++) {
        for (let f = 0; f < charScale; f++) {
          const g = (f + e * charSize.w) * 4;
          
          for (let h = 0; h < 4; h++) {
            charImg.pixels[charImgIndex + g + h] = defaultImg.pixels[defaultImgIndex + h];
          }
        }
      }
    }
  }

  charImg.updatePixels();
  chars.push(charImg);
}

function showChars() {
  let i = 0;
  
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      const x = c * charSize.w + leftOffset;
      const y = r * charSize.h + topOffset;
      
      image(chars[i], x, y);
      i++;
    }
  }
}

function showCharOutlines() {
  noFill();
  stroke(50, 100, 150);
  
  for (let r = 0; r < charRows; r++) {
    for (let c = 0; c < charCols; c++) {
      const x = c * charSize.w + leftOffset;
      const y = r * charSize.h + topOffset;
      const w = charSize.w;
      const h = charSize.h;
      
      rect(x, y, w, h);
    }
  }
}