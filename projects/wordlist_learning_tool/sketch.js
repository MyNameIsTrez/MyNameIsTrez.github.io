let wordsExist = false;
let words = { 1: [], 2: [], 3: []};
let index = 0;
let released = true;
let showAnswer = true;
let done = false;

function setup() {
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(getData);
}

function getData() {
  // let spreadsheetFilter = 'select%20B%2C%20offset%201' // select B, offset 1

  let spreadsheetFilter = 'select%20B' // select B
  let query = new google.visualization.Query(spreadsheetURL + '/gviz/tq?tq=' + spreadsheetFilter);
  query.send(handleQueryResponse1);
  
  spreadsheetFilter = 'select%20D' // select D
  query = new google.visualization.Query(spreadsheetURL + '/gviz/tq?tq=' + spreadsheetFilter);
  query.send(handleQueryResponse2);
}

function handleQueryResponse1(response) {
  const data = response.getDataTable();
  dataIntoWordArray1(data);
}

function handleQueryResponse2(response) {
  const data = response.getDataTable();
  dataIntoWordArray2(data);
}

function dataIntoWordArray1(data) {
  for (let i = 0; i < data.wg.length; i++) {
    words[1][i] = data.wg[i].c[0].v;
  }

  document.getElementById('words1').innerHTML = words[1][index];
  document.getElementById('progress').innerHTML = `${(index + 1)}/${words[1].length}`;
}

function dataIntoWordArray2(data) {
  for (let i = 0; i < data.wg.length; i++) {
    words[2][i] = data.wg[i].c[0].v;
  }

  wordsExist = true;
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
    
    if (index >= words[1].length) {
      document.getElementById("words1").innerHTML = 'You\'re done!';
      document.getElementById("words2").innerHTML = '';
      done = true;
    }

    if (done) return;

    switch(mouseButton) {
      case RIGHT:
        if (!showAnswer) {
          document.getElementById("words1").innerHTML = words[1][index];
          document.getElementById("words2").innerHTML = '';
          document.getElementById("progress").innerHTML = `${(index + 1)}/${words[1].length}`;

          words[1].push(words[1][index - 1]);
          words[3][index - 1] = words[1][index - 1];

          showAnswer = true;
        } else {        
          document.getElementById("words2").innerHTML = words[2][index];
          document.getElementById("progress").innerHTML = `${(index + 1)}/${words[1].length}`;

          words[1].push(words[1][index]);
          words[3][index] = words[1][index];

          index++;
          showAnswer = false;
        }
        break;
      case LEFT:
        if (!showAnswer) {
          document.getElementById("words1").innerHTML = words[1][index];
          document.getElementById("words2").innerHTML = '';
          document.getElementById("progress").innerHTML = `${(index + 1)}/${words[1].length}`;

          showAnswer = true;
        } else {        
          document.getElementById("words2").innerHTML = words[2][index];

          index++;
          showAnswer = false;
        }
        break;
    }
  }
}

addEventListener('contextmenu', (e) => {
  e.preventDefault();
});