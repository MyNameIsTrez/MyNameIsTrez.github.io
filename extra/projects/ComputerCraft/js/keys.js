// 'keyCode' doesn't seem to use the same ASCII char set,
// so that's why charKeysLookup.js has to be accessed by this function to type a character.
function keyPressed() {
  const eo = window.event ? event : e; // eo is eventObject

  const key = eo.key;
  const codeStr = eo.code; // codeStr is str, keyCode is num

  const ctrl = eo.ctrlKey;
  const shift = eo.shiftKey;

  switch (key) {
    case 'Enter':
      term.enter();
      return;
    case 'Backspace':
      term.backspace();
      return;

      // case 'y': // 'y'
      //   if (ctrl) {
      //     alert('ctrl + y');
      //     return; // Because the code after the switch shouldn't be reached if the program got here.
      //   }
      //   break;
      // case 'z':
      //   if (ctrl) {
      //     if (shift) {
      //       alert('ctrl + shift + z');
      //     } else {
      //       alert('ctrl + z');
      //     }
      //     return;
      //   }
      //   break;

    case '{':
      if (ctrl && shift) {
        type(1); // smiley non-filled
        return;
      }
      break;
    case '}':
      if (ctrl && shift) {
        type(2); // smiley filled
        return;
      }
      break;
  }

  const onlyCtrl = key === 'Control' && ctrl;
  const onlyShift = key === 'Shift' && shift;

  if (!(onlyCtrl || onlyShift)) {
    typeKey(key, keyCode, codeStr);
  }
}

function typeKey(key, keyCode, codeStr) {
  if (Object.keys(keys).includes(key)) {
    type(keys[key]);
  } else {
    console.warn(key + ' / ' + keyCode + ' / ' + codeStr + ' is unknown!');
  }
}

function type(n) {
  term.cursor.typing.push(n);
}

function getKeyByValue(object, value) {
  const result = Object.keys(object).find(key => object[key] === value);
  
  if (!result) {
    console.warn('getKeyByValue() got an invalid value!');
  }
  
  return result;
}