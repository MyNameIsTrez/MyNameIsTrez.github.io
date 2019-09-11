let wordsExist = false; // true if the words have been loaded in
let words = []; // array containing arrays of the two languages
let index = 0;
let released = true; // whether the lmb has been released
let showAnswer = true;
let done = false;
let data = []; // raw data from the Google Spreadsheet
let oneDirection; // whether the words get asked in one direction only
const filterAnnouncement = '/gviz/tq?tq=select%20'; // necessary to add filters to URLs
// const filters = ['D', 'E']
const filters = ['D', 'E', 'G', 'H']
let temp = 0; // makes sure the words only get generated once all data has been gotten
const timeBetweenQueries = 250; // in ms

function setup() {
  getOneDirection()
  getAllData();
}

function getOneDirection() {
  oneDirection = document.querySelectorAll('oneDirection').checked; // whether the words get asked in one direction only
}

function getAllData() {
  google.charts.load('current', {
    packages: ['corechart']
  });
  google.charts.setOnLoadCallback(sendQueries(filters.length));
}

// The response.getDataTable() contains nulls, because the google.visualization.Query() function
// looks at the longest column, no matter if you requested that column, and assumes that's how many items
// the requested column should return.
// This means we need to filter out all the nulls that we get when the column we are requesting isn't the longest one.
function filterOutNulls(response) {
  const dataTable = response.getDataTable();

  const filtered = dataTable.wg.filter(function (value, index, arr) {
    const kept = value.c[0].v !== null;
    return kept;
  });

  dataTable.wg = filtered;
  return dataTable;
}

function getData(filter, i) {
  const query = new google.visualization.Query(spreadsheetURL + filterAnnouncement + filter);
  query.send(function (response) {
    const filtered = filterOutNulls(response);
    data.push(filtered);
    temp++;
    if (temp === 2) {
      temp = 0;
      dataToWords(i);
    }
  });
}

function sendQueries(i) {
  if (--i > -1) {
    setTimeout(function () {
      console.log(`Sent query ${filters.length - i}/${filters.length}`);
      getData(filters[i], i);
      sendQueries(i);
    }, timeBetweenQueries);
  }
}

function dataToWords(i) {
  for (let j = 0; j < data[0].wg.length; j++) {
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

    console.log(a + i, b + i)
    const word1 = data[a + i].wg[j].c[0].v;
    const word2 = data[b + i].wg[j].c[0].v;
    words.push([word1, word2]);
  }

  words = shuffle(words);

  document.getElementById('words1').innerHTML = words[index][0];
  document.getElementById('progress').innerHTML = `${index + 1}/${words.length}`;

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

function rmb() {
  if (!showAnswer) {
    // if the word hasn't been added to the end of words yet, do so
    if (!(words[index - 1][0] === words[words.length - 1][0])) {
      words.push([words[index - 1][0], words[index - 1][1]]);
      words[1].push([words[index - 1][0], words[index - 1][1]]);
    }

    document.getElementById("words1").innerHTML = words[index][0];
    document.getElementById("words2").innerHTML = '';

    const progress = `${index + 1}/${words.length}`;
    document.getElementById("progress").innerHTML = progress;

    showAnswer = true;
  } else {
    words.push([words[index][0], words[index][1]]);
    words[1].push([words[index][0], words[index][1]]);

    document.getElementById("words2").innerHTML = words[index][1];

    const progress = `${index + 1}/${words.length}`;
    document.getElementById("progress").innerHTML = progress;

    index++;
    showAnswer = false;
  }
}

function lmb() {
  if (!showAnswer) {
    document.getElementById("words1").innerHTML = words[index][0];
    document.getElementById("words2").innerHTML = '';

    const progress = `${index + 1}/${words.length}`;
    document.getElementById("progress").innerHTML = progress;

    showAnswer = true;
  } else {
    document.getElementById("words2").innerHTML = words[index][1];

    index++;
    showAnswer = false;
  }
}

function mousePressed() {
  if (wordsExist) {
    if (!released) {
      return;
    }
    released = false;

    if (index >= words.length) {
      document.getElementById("words1").innerHTML = 'You\'re done!';
      document.getElementById("words2").innerHTML = '';
      done = true;
    }

    if (done) return;

    switch (mouseButton) {
      case RIGHT:
        rmb();
        break;
      case LEFT:
        lmb();
        break;
    }
  }
}

// removes the context menu from a right mouse button click
addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
