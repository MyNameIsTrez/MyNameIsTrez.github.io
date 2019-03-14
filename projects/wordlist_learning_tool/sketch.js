let index = 0;
let countDiv;

function setup() {
  countDiv = createDiv(words[index]);
  countDiv.style('font-size', '100pt');
}

function mousePressed() {
  if (mouseButton === RIGHT) { // repeat the words later
    words.push(words[index]);
  }
  if (index < words.length - 1) {
    index++;
    countDiv.html(words[index]);
  } else {
    countDiv.html("You're done!");
    exit;
  }
}

addEventListener("contextmenu", (e) => {
  e.preventDefault();
});