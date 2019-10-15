const pages = [1, 2, 3]; // which pages of words the user wants to learn

let wordsExist = false; // true if the words have been loaded in
let words = []; // array containing arrays of the two languages
let index = 0;
let released = true; // whether the lmb has been released
let showAnswer = true;
let done = false;
let data = []; // raw data from the Google Spreadsheet
let oneDirection; // whether the words get asked in one direction only
const filterAnnouncement = '/gviz/tq?tq=select'; // necessary to add filter to URL
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
  google.charts.setOnLoadCallback(sendQuery(pages));
  // setTimeout(function () {
  //   google.charts.setOnLoadCallback(getData(filter[filter.length], filter.length));
  // }, timeBetweenQueries);
}

// The response.getDataTable() contains nulls, because the google.visualization.Query() function
// looks at the longest column, no matter if you requested that column, and assumes that's how many items
// the requested column should return.
// This means we need to filter out all the nulls that we get when the column we are requesting isn't the longest one.
function filterOutNulls(response) {
  let dataTable = response.getDataTable();

  let filtered = [];
  for (const i in dataTable.wg) {
    // remove nulls and objects with null as their value
    filtered[i] = dataTable.wg[i].c.filter(function (value, index, arr) {
      const kept = value !== null && value.v !== null;
      return kept;
    });

    // remove empty arrays
    if (!filtered[i].length) {
      filtered.splice(i, 1);
      break;
    }
  }

  dataTable.wg = filtered;
  return dataTable;
}

function getData(filter) {
  const URL = spreadsheetURL + filterAnnouncement + filter;
  const query = new google.visualization.Query(URL);
  query.send(function (response) {
    const filtered = filterOutNulls(response);
    data.push(filtered);
    dataToWords();
  });
}

function sendQuery(pages) {
  // Uses the page numbers from pages[] to get the corresponding letters from the spreadsheet!
  const pageLetters = [
    // Duits - Examenidioom pagina 59-61
    ['A', 'B'],
    ['D', 'E'],
    ['G', 'H']

    // Duits - Woordenlijst Leiden 1-10
    // ['D', 'E'],
    // ['G', 'H'],
    // ['J', 'K'],
    // ['M', 'N'],
    // ['P', 'Q'],
    // ['S', 'T'],
    // ['V', 'W'],
    // ['Y', 'Z'],
    // ['AB', 'AC'],
    // ['AE', 'AF']
  ];
  let filters = [];
  for (const page of pages) {
    filters.push(pageLetters[page-1]);
  }

  // make a filter string out of the entered filters
  let filter = '';
  for (let i = 0; i < filters.length; i++) {
    for (let j = 0; j < 2; j++) {
      filter += '%20' + filters[i][j];
      // if this isn't the last filter
      if (i+j !== filters.length) {
        filter += '%2C'
      }
    }
  }
  
  // I don't know why I need this setTimeout().
  setTimeout(function () {
    getData(filter);
  }, timeBetweenQueries);
}

function dataToWords() {
  const dataWords = data[0].wg;
  for (let i = 0; i < dataWords.length; i++) {
    for (let j = 0; j < dataWords[i].length/2; j++) {
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

      const offset = j * 2;
      const word_pair = [dataWords[i][a + offset].v, dataWords[i][b + offset].v]
      words.push([word_pair[0], word_pair[1]]);
    }
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
