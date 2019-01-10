// use `node parseMidi.js` in this folder to execute



// Home PC
// let outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;

// School Laptop
// let outputFolder = `C:/Users/MML-INFORMATICA/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;



/*
* TODO
* Fix the parsing of the first line, so that the pitch is correct.
* Currently, the CC Lua program can only read multiple pitches of the same instrument
  at the same time in the same 'object' if it's pitches are either 0-15 or 16-24.
  I need to add the ability to play pitches from 0-24 in the same 'object'.
*/



// uneditable setup variables
let fs = require(`fs`);
let midiParser = require(`./midi-parser.js`);

let inputFolder = `./input`;
let outputFolder = `./output`;

let names = fs.readdirSync(inputFolder);

let instruments = [`bass`, `snare`, `hat`, `bassdrum`, `harp`];



for (let name in names) {
  name = names[name].replace(/\.[^/.]+$/, ``);
  let data = fs.readFileSync(`./input/` + name + `.mid`, `base64`);
  let midiArray = midiParser.parse(data);
  var songList = [];
  var line = 0;
  var lineOne = false; // possibly unnecessary



  // get a top 5 of the track indexes with the highest amount of note events
  let tracksEventCount = []; // how many note events each track has
  let trackIndexes = getTrackIndexes();

  function getTrackIndexes() {
    for (let track of midiArray.track) { // for every track, max of 5 tracks with 5 noteblock instruments
      tracksEventCount[midiArray.track.indexOf(track)] = 0;
      for (let event of track.event) { // for every event
        if (event.type === 9) { // if the event type is `Note On`
          tracksEventCount[midiArray.track.indexOf(track)]++;
        }
      }
    }

    let unsortedTracksEventCount = tracksEventCount.slice(0);
    // sorts the array from high to low, removes the zero's and makes the array length a maximum of 5
    tracksEventCount = tracksEventCount.sort(function (a, b) {
      return b - a
    }).filter(number => number > 0).slice(0, 5);

    let trackIndexes = [];
    for (let i = 0; i < tracksEventCount.length; i++) {
      trackIndexes[i] = unsortedTracksEventCount.indexOf(tracksEventCount[i]);
    }
    return trackIndexes;
  }



  // interlaces the tracks
  // console.log(tracksEventCount[0]);
  for (let i = 0; i < tracksEventCount[0]; i++) { // loop the largest amount of note events a track has times
    for (index = 0; index < trackIndexes.length; index++) { // loop the length of trackIndexes, 5, times
      let track = midiArray.track[trackIndexes[index]]; // pick a new track from the largest to the smallest
      let instrument = instruments[index]; // pick a new instrument that is based on the track index
      checkIfNote(track, instrument);
    }
  }



  function checkIfNote(track, instrument) { // returns out of this loop when the next track can be played
    for (let event of track.event) { // for every event
      if (event.type === 9) { // if the event type is `Note On`
        let time = Math.round(event.deltaTime / 20); // the sleep time between now and the next note event
        if (line === 0) {
          createEvent(event, 40, instrument);
        } else {
          createEvent(event, time, instrument);
        }
        return // returns out of this loop so the next track can be played
      }
    }
  }



  // create a new note event or add onto an existing one
  console.log(`Parsing...`)

  function createEvent(event, time, instrument) {
    if (time > 0) {
      if (lineOne === true) {
        line++;
        lineOne = false;
      }
      if (line === 0) { // if this is the first line, don't skip to the next line
        songList[line] = [time, [instrument]]; // create new event at line 0 with a delay
        lineOne = true;
      } else {
        songList[++line] = [time, [instrument]]; // create new event
      }
    }

    for (let index in event.data) { // an 'in' loop gets you the index of an array, 'of' gets you the elements in the array
      pitch = Math.round(event.data[index] / (127 / 24)); // pitch 0-127 mapping to pitch 0-24
      songList[line][1].push(pitch) // add extra pitch to tone
    }
  }



  // final parsing details
  songList = JSON.stringify(songList).replace(/\[/g, `{`); // replace `[` with `{`
  songList = JSON.stringify(songList).replace(/\]/g, `}`); // replace `]` with `}`
  songList = songList.replace(/\\/g, ``); // remove `\`
  songList = songList.substring(1, songList.length - 1);
  songList = `songList = ` + songList; // add `songList = ` to the beginning of the songList



  // write to file
  fs.writeFileSync(outputFolder + `/` + name + `.json`, songList, {
    spaces: 2,
    EOL: `\r\n`
  }, function (err) {
    if (err) console.error(err);
  })
  console.log(`Done!`)
}