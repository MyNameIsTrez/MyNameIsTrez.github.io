let index = 0;
let countDiv, progressDiv;
let difficultWords = [];

words = words.split(' ');
for (let i = 0; i < words.length; i++) {
  const regex = /_/gi;
  words[i] = words[i].replace(regex, ' ');
}

function setup() {
  document.body.style.backgroundColor = '#073642';
  countDiv = createDiv(words[index]);
  countDiv.style('font-size', '100pt');
  countDiv.style('color', 'white');
  
  progressDiv = createDiv(`${(index + 1)}/${words.length}`);
  progressDiv.style('font-size', '100pt');
  progressDiv.style('color', 'white');
}

let released = true;

function mouseReleased(){
	released = true;
	return false;
}

function mousePressed() {
	if(!released){
		return;
	}
  released = false;
  
  if (mouseButton === RIGHT) { // repeat the words later
    words.push(words[index]);
    difficultWords.push(words[index]);
    progressDiv.html(`${(index + 1)}/${words.length}`);
  }

  if (index < words.length - 1) {
    index++;
    countDiv.html(words[index]);
    progressDiv.html(`${(index + 1)}/${words.length}`);
  } else {
    countDiv.html('You\'re done!');
    exit;
  }
}

addEventListener('contextmenu', (e) => {
  e.preventDefault();
});