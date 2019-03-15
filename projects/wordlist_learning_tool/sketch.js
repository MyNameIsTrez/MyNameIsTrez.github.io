let wordsExist = false;
let words = [];
let index = 0;
let difficultWords = [];
let released = true;

function setup() {
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(getData);
}

function getData() {
  let SPREADSHEET_URL = 'https://docs.google.com/a/google.com/spreadsheets/d/1t3TuSANJlhotUmUpOIBQNYyZMU6rmNSAOge-KkssOpQ/gviz/tq?tq=select%20A';
  let query = new google.visualization.Query(SPREADSHEET_URL);
  query.setQuery('select *');
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  let data = response.getDataTable();
  dataIntoWordArray(data);
}

function dataIntoWordArray(data) {
  for (let i = 0; i < data.wg.length; i++) {
    words[i] = data.wg[i].c[0].v;
  }
  wordsExist = true;
  document.getElementById("word").innerHTML = words[index];
  document.getElementById("progress").innerHTML = `${(index + 1)}/${words.length}`;
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
      document.getElementById("progress").innerHTML = `${(index + 1)}/${words.length}`;
    }

    if (index < words.length - 1) {
      index++;
      document.getElementById("word").innerHTML = words[index];
      document.getElementById("progress").innerHTML = `${(index + 1)}/${words.length}`;
    } else {
      document.getElementById("word").innerHTML = 'You\'re done!';
      exit;
    }
  }
}

addEventListener('contextmenu', (e) => {
  e.preventDefault();
});