let wordsExist = false;
let words = [
  [],
  []
];
let index = 0;
let released = true;
let showAnswer = true;
let done = false;
let data = []; // words of the questions and answers
let oneDirection;

function setup() {
  oneDirection = document.querySelectorAll('oneDirection').checked; // whether the words get asked in one direction

  document.getElementById("words1").innerHTML = 'Click once before this disappears on mobile!';
  google.charts.load('current', {
    packages: ['corechart']
  });
  google.charts.setOnLoadCallback(sendQuery1);
}

function sendQuery1() {
  // let spreadsheetFilter = 'select%20B%2C%20offset%201' // select B, offset 1
  let spreadsheetFilter = 'select%20B' // select B
  let query = new google.visualization.Query(spreadsheetURL + '/gviz/tq?tq=' + spreadsheetFilter);
  query.send(queryToData1);
}

function queryToData1(response) {
  data.push(response.getDataTable());
  sendQuery2();
}

function sendQuery2() {
  spreadsheetFilter = 'select%20D' // select D
  query = new google.visualization.Query(spreadsheetURL + '/gviz/tq?tq=' + spreadsheetFilter);
  query.send(queryToData2);
}

function queryToData2(response) {
  data.push(response.getDataTable());
  dataToWords();
}

function dataToWords() {
  for (let i = 0; i < data[0].wg.length; i++) {
    let a, b;
    if (oneDirection) {
      a = 0;
      b = 1;
    } else {
      a = round(random());
      if (a === 0) {
        b = 1;
      } else {
        b = 0;
      }

    }

    words[0].push([]);
    words[0][i][0] = data[a].wg[i].c[0].v;
    words[0][i][1] = data[b].wg[i].c[0].v;
  }

  words[0] = shuffle(words[0]);

  document.getElementById('words1').innerHTML = words[0][index][0];
  document.getElementById('progress').innerHTML = `${index + 1}/${words[0].length}`;

  wordsExist = true;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mouseReleased() {
  if (wordsExist) {
    released = true;
    return false;
  }
}

function mousePressed() {
  if (wordsExist) {
    if (!released) {
      return;
    }
    released = false;

    if (index >= words[0].length) {
      document.getElementById("words1").innerHTML = 'You\'re done!';
      document.getElementById("words2").innerHTML = '';
      done = true;
    }

    if (done) return;

    switch (mouseButton) {
      case RIGHT:
        if (!showAnswer) {
          // if the word hasn't been added to the end of words[0] yet, do so
          if (!(words[0][index - 1][0] === words[0][words[0].length - 1][0])) {
            words[0].push([words[0][index - 1][0], words[0][index - 1][1]]);
            words[1].push([words[0][index - 1][0], words[0][index - 1][1]]);
          }

          document.getElementById("words1").innerHTML = words[0][index][0];
          document.getElementById("words2").innerHTML = '';

          let progress = `${index + 1}/${words[0].length}`;
          document.getElementById("progress").innerHTML = progress;

          showAnswer = true;
        } else {
          words[0].push([words[0][index][0], words[0][index][1]]);
          words[1].push([words[0][index][0], words[0][index][1]]);

          document.getElementById("words2").innerHTML = words[0][index][1];

          let progress = `${index + 1}/${words[0].length}`;
          document.getElementById("progress").innerHTML = progress;

          index++;
          showAnswer = false;
        }
        break;
      case LEFT:
        if (!showAnswer) {
          document.getElementById("words1").innerHTML = words[0][index][0];
          document.getElementById("words2").innerHTML = '';

          let progress = `${index + 1}/${words[0].length}`;
          document.getElementById("progress").innerHTML = progress;

          showAnswer = true;
        } else {
          document.getElementById("words2").innerHTML = words[0][index][1];

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