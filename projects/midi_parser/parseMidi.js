// use `node parseMidi.js` in this folder to execute

/*
* TODO:
* []
  [[10, [`snare`, 3, 5]], [20, [`harp`, 4, 18]], [10, [`bassdrum`, 7, 15]]] make a new element for each track, of note event 0
  [[ 0, [`snare`, 3, 5]], [10, [`harp`, 4, 18]], [ 0, [`bassdrum`, 7, 15]]] subtract 10 from all the elements, because it's the lowest time
  [[ 0, [`snare`, 3, 5]], [10, [`harp`, 4, 18]], [ 0, [`bassdrum`, 7, 15]]] play track 0 and 2's notes, because element 0 and 2 are both a time of 0
  [[ 0, [`snare`, 3, 5]], [10, [`harp`, 4, 18]], [ 0, [`bassdrum`, 7, 15]]] sleep 10, because you just removed that amount
  [[35, [`bass`, 16, 8]], [10, [`harp`, 4, 18]], [20, [`hat`, 18, 5]]] make a new element for track 0 and 2, of note event 1
* Sort the tracks from largest to smallest in the output JSON.
* Currently, the CC Lua program can only read multiple pitches of the same instrument
  at the same time in the same 'object' if it's pitches are either 0-15 or 16-24.
  I need to add the ability to play pitches from 0-24 in the same 'object'.
*/

// uneditable setup variables
const fs = require(`fs`);
const midiParser = require(`./midi-parser.js`);

const inputFolder = `./input/`;
const names = fs.readdirSync(inputFolder);
const instruments = [`bass`, `snare`, `hat`, `bassdrum`, `harp`];

// The `output` folder
// const outputFolder = `./output/`;
// Home PC Tekkit Classic folder
const outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2/`;
// School Laptop Tekkit Classic folder
// const outputFolder = `C:/Users/MML-INFORMATICA/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2/`;

const nps = 1; // the amount of times a single noteblock can make a sound in a second

for (let name in names) {
  name = names[name].replace(/\.[^/.]+$/, ``);
  const data = fs.readFileSync(inputFolder + name + `.mid`, `base64`);
  let midi = midiParser.parse(data);

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
  let unsortedTracksNoteCount;
  var tracksNoteCount = getTracksNoteCount();
  // get the indexes of the tracks of tracksNoteCount
  var trackIndexes = getTrackIndexes();

  function getTracksNoteCount() {
    tracksNoteCount = [];

    // calculates the number of note events a track has
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
  let midiArray = [];
  for (let i = 0; i < midi.track.length; i++) {
    midiArray.push(midi.track[i].event);
  }

  // replaces `[{deltatime:, data:}, {deltatime:, data:}], [{deltatime:, data:}]`
  // with `[[deltatime:, data:], [deltatime:, data:]], [[deltatime:, data:]]`
  for (let i = 0; i < midiArray.length; i++) {
    for (let j = 0; j < midiArray[i].length; j++) {
      let data = midiArray[i][j].data;
      midiArray[i][j] = [midiArray[i][j].deltaTime / nps, [instruments[i]]];
      for (let k = 0; k < data.length; k++) {
        midiArray[i][j][1].push(data[k]);
      }
    }
  }

  // final parsing details
  // replaces `[` with `{`
  midiArray = JSON.stringify(midiArray).replace(/\[/g, `{`);
  // replaces `]` with `}`
  midiArray = JSON.stringify(midiArray).replace(/\]/g, `}`);
  // removes `\`
  midiArray = midiArray.replace(/\\/g, ``);
  midiArray = midiArray.substring(1, midiArray.length - 1);
  // adds `midiArray = ` to the beginning of the midiArray
  midiArray = `midiArray = ` + midiArray;

  // write to file
  fs.writeFileSync(outputFolder + name + '.json', midiArray, {
    spaces: 2,
    EOL: '\r\n'
  }, function (err) {
    if (err) console.error(err);
  });
}