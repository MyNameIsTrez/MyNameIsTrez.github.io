// use `node parseMidi.js` in this folder to execute

/*
* TODO:
* []
  [[10, [`snare`, 3, 5]], [20, [`harp`, 4, 18]], [10, [`bassdrum`, 7, 15]]] make a new element for each track, of note event 0
  [[ 0, [`snare`, 3, 5]], [10, [`harp`, 4, 18]], [ 0, [`bassdrum`, 7, 15]]] subtract 10 from all the elements, because it's the lowest time
  [[ 0, [`snare`, 3, 5]], [10, [`harp`, 4, 18]], [ 0, [`bassdrum`, 7, 15]]] play track 0 and 2's notes, because element 0 and 2 are both a time of 0
  [[ 0, [`snare`, 3, 5]], [10, [`harp`, 4, 18]], [ 0, [`bassdrum`, 7, 15]]] sleep 10, because you just removed that amount
  [[35, [`bass`, 16, 8]], [10, [`harp`, 4, 18]], [20, [`hat`, 18, 5]]] make a new element for track 0 and 2, of note event 1
* Currently, the CC Lua program can only read multiple pitches of the same instrument
  at the same time in the same 'object' if it's pitches are either 0-15 or 16-24.
  I need to add the ability to play pitches from 0-24 in the same 'object'.
*/

// uneditable setup variables
const fs = require(`fs`);
const midiParser = require(`./midi-parser.js`);

const inputFolder = `./input/`;
const names = fs.readdirSync(inputFolder);

// The `output` folder
const outputFolder = `./output/`;
// Home PC Tekkit Classic folder
// const outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;
// School Laptop Tekkit Classic folder
// const outputFolder = `C:/Users/MML-INFORMATICA/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;

const instruments = [`bass`, `snare`, `hat`, `bassdrum`, `harp`];

for (let name in names) {
  name = names[name].replace(/\.[^/.]+$/, ``);
  const data = fs.readFileSync(inputFolder + name + `.mid`, `base64`);
  let midi = midiParser.parse(data);

  var songList = [];
  var line = 0;
  var lineOne = false;

  // delete all the keys that aren't part of the track
  Object.keys(midi).forEach(key => {
    if (key !== `track`) {
      delete midi[key];
    }
  });

  // filter out events that aren't of type 9
  for (const track of midi.track) {
    track.event = track.event.filter(event => {
      return event.type === 9
    });
  }

  // get the top 5 of how many note events each track has
  var unsortedTracksNoteCount;
  var tracksNoteCount = getTracksNoteCount();
  // get the indexes of the tracks of tracksNoteCount
  var trackIndexes = getTrackIndexes();

  function getTracksNoteCount() {
    tracksNoteCount = [];
    // for every track, max of 5 tracks with 5 noteblock instruments
    for (let track of midi.track) {
      tracksNoteCount[midi.track.indexOf(track)] = 0;
      for (let event of track.event) {
        tracksNoteCount[midi.track.indexOf(track)]++;
      }
    }

    // copy tracksNoteCount
    unsortedTracksNoteCount = tracksNoteCount.slice(0);
    // sorts the array from high to low, removes the tracks with zero note events and makes the array length a maximum of 5
    tracksNoteCount = tracksNoteCount.sort(function (a, b) {
      return b - a
    }).filter(number => number > 0).slice(0, 5);
    return tracksNoteCount;
  }

  function getTrackIndexes() {
    trackIndexes = [];
    for (let i = 0; i < tracksNoteCount.length; i++) {
      trackIndexes.push(unsortedTracksNoteCount.indexOf(tracksNoteCount[i]));
    }
    return trackIndexes;
  }

  // remove the tracks that aren't part of the top 5 tracks
  midi.track = midi.track.filter(track => {
    return trackIndexes.includes(midi.track.indexOf(track));
  });

  // replaces `{tracks: {event: [note events]}, {event: [note events]}}` with `[note events], [note events]`
  // and puts the result in the new constant, midiArray
  const midiArray = [];
  for (let i = 0; i < midi.track.length; i++) {
    midiArray.push(midi.track[i].event);
  }

  // write to file
  fs.writeFileSync(outputFolder + name + '.json', JSON.stringify(midiArray), {
    spaces: 2,
    EOL: '\r\n'
  }, function (err) {
    if (err) console.error(err);
  });

  // creates a new note event or adds onto an existing one
  function createEvent(event, time, instrument) {
    if (line === 0) {
      time = 40;
    }

    if (time > 0) {
      if (lineOne === true) {
        line++;
        lineOne = false;
      }
      // if this is the first line, don't skip to the next line
      if (line === 0) {
        // create a new event at line 0 with a delay
        songList[line] = [time, [instrument]];
        lineOne = true;
      } else {
        // create a new event
        songList[++line] = [time, [instrument]];
      }
    }

    for (let index in event.data) {
      // pitch 0-127 to pitch 0-24
      // pitch = Math.round(event.data[index] * (24 / 127));

      // pitch 0-127 to pitch 0-24
      pitch = Math.round(event.data[index]);

      // add extra pitch to tone
      songList[line][1].push(pitch)
    }
  }

  // final parsing details
  // replace `[` with `{`
  songList = JSON.stringify(songList).replace(/\[/g, `{`);
  // replace `]` with `}`
  songList = JSON.stringify(songList).replace(/\]/g, `}`);
  // remove `\`
  songList = songList.replace(/\\/g, ``);
  songList = songList.substring(1, songList.length - 1);
  // add `songList = ` to the beginning of the songList
  songList = `songList = ` + songList;
}