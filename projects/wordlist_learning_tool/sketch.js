let wordsExist = false;
let words = [];
let index = 0;
let difficultWords = [];
let countDiv, progressDiv;
let released = true;

function setup() {
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(getData);

  countDiv = createDiv(words[index]);
  countDiv.style('font-size', '100pt');
  countDiv.style('color', 'white');
  
  progressDiv = createDiv('Loading...');
  progressDiv.style('font-size', '100pt');
  progressDiv.style('color', 'white');
}

function getData() {
    console.log('started getData()');
    // https://docs.google.com/spreadsheets/d/1t3TuSANJlhotUmUpOIBQNYyZMU6rmNSAOge-KkssOpQ/edit?usp=sharing
    let SPREADSHEET_URL = 'https://docs.google.com/a/google.com/spreadsheets/d/1t3TuSANJlhotUmUpOIBQNYyZMU6rmNSAOge-KkssOpQ/gviz/tq?tq=select%20A';
    let query = new google.visualization.Query(SPREADSHEET_URL);
    query.setQuery('select A');
    query.send(handleQueryResponse);
    console.log('finished getData()');
}

function handleQueryResponse(response) {
    console.log('started handleQueryResponse(response)');
    let data = response.getDataTable();
    console.log('finished handleQueryResponse(response)');
    dataIntoWordArray(data);
}

function dataIntoWordArray(data) {
    for (let i = 0; i < data.wg.length; i++) {
        words[i] = data.wg[i].c[0].v;
    }
    wordsExist = true;
    countDiv.html(words[index]);
    progressDiv.html(`${(index + 1)}/${words.length}`);
}

function mouseReleased(){
  if (wordsExist) {
    released = true;
    return false;
  }
}

function mousePressed() {
  if (wordsExist) {
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
}

addEventListener('contextmenu', (e) => {
  e.preventDefault();
});