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
let fs = require(`fs`);
let midiParser = require(`./midi-parser.js`);

let inputFolder = `./input/`;
let names = fs.readdirSync(inputFolder);

// The `output` folder
let outputFolder = `./output/`;
// Home PC Tekkit Classic folder
// let outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;
// School Laptop Tekkit Classic folder
// let outputFolder = `C:/Users/MML-INFORMATICA/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;

let instruments = [`bass`, `snare`, `hat`, `bassdrum`, `harp`];

for (let name in names) {
  name = names[name].replace(/\.[^/.]+$/, ``);
  let data = fs.readFileSync(inputFolder + name + `.mid`, `base64`);
  let midiArray = midiParser.parse(data);

  var songList = [];
  var line = 0;
  var lineOne = false;

  // filter out events that aren't of type 9
  for (const track of midiArray.track) {
    track.event = track.event.filter(event => {
      // console.log(event.type === 9);
      return event.type === 9
    });
  }

  // top 5 of how many note events each track has
  var unsortedTracksNoteCount;
  var tracksNoteCount = getTracksNoteCount();
  // indexes of the tracks of tracksNoteCount
  var trackIndexes = getTrackIndexes();
  // console.log(unsortedTracksNoteCount, tracksNoteCount, trackIndexes);

  function getTracksNoteCount() {
    tracksNoteCount = [];
    // for every track, max of 5 tracks with 5 noteblock instruments
    for (let track of midiArray.track) {
      tracksNoteCount[midiArray.track.indexOf(track)] = 0;
      for (let event of track.event) {
        tracksNoteCount[midiArray.track.indexOf(track)]++;
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

  midiArray.track = midiArray.track.filter(track => {
    return trackIndexes.includes(midiArray.track.indexOf(track));
  });

  // write to file
  fs.writeFileSync(outputFolder + name + 'Midi' + '.json', JSON.stringify(midiArray), {
    spaces: 2,
    EOL: '\r\n'
  }, function (err) {
    if (err) console.error(err);
  })

  // create a new note event or add onto an existing one
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

  // write to file
  fs.writeFileSync(outputFolder + name + `.json`, songList, {
    spaces: 2,
    EOL: `\r\n`
  }, function (err) {
    if (err) console.error(err);
  })
  console.log(`Done!`)
}