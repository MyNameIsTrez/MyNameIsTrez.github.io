// use `node parseMidi.js` in this folder to execute



// Home PC
// let outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;

// School Laptop
// let outputFolder = `C:/Users/MML-INFORMATICA/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;



/*
* TODO
* Tracks are currently played one after each other. They need to be interlaced.
* Currently, the CC Lua program can only read multiple pitches of the same instrument
  at the same time in the same 'object' if it's pitches are either 0-15 or 16-24.
  I need to add the ability to play pitches from 0-24 in the same 'object'.
*/



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
  // var line = 0;

  // let instrumentIndex = 2; // changes which instrument belongs to the first played track from the midi file



  let trackIndexes = getTrackIndexes();
  // console.log(trackIndexes)

  function getTrackIndexes() {
    let tracksEventCount = []; // how many note events each track has

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
    tracksEventCount = tracksEventCount.sort(function (a, b) { return b - a }).filter(number => number > 0).slice(0, 5);

    let trackIndexes = [];
    for (let i = 0; i < tracksEventCount.length; i++) {
      trackIndexes[i] = unsortedTracksEventCount.indexOf(tracksEventCount[i]);
    }
    return trackIndexes;
  }



























  // for (let eventCount of tracksEventCount) {
  //   topFiveTracks(eventCount);
  // }

  // function topFiveTracks(eventCount) { // there is a maximum of 5 tracks MC can play, so we track the top 5
  //   for (let index = 0; index < 5; index++) {
  //     if (eventCount > usedTrackIndexes[index]) {
  //       usedTrackIndexes[index + 1] // move the index of the usedTrackIndexes to the right
  //       usedTrackIndexes[index] = tracksEventCount.indexOf(eventCount); // store the index of the track
  //       return;
  //     }
  //   }
  // }



  // for (let track of midiArray.track) { // for every track, max of 5 tracks with 5 noteblock instruments
  //   let instrument = instruments[instrumentIndex++ % instruments.length]; // pick a new instrument

  //   for (let event of track.event) { // for every event
  //     if (event.type === 9) { // if the event type is `Note On`
  //       let time = event.deltaTime / 20; // sleep between pitches

  //       if (line === 0) { // if this is the first line, have a delay
  //         createEvent(40, instrument);
  //       } else { // create a new event/add onto an existing event
  //         createEvent(time, instrument);
  //       }
  //     }
  //   }
  // }



  // replace `[]` with `{}` and add `songList = ` to the beginning
  songList = JSON.stringify(songList).replace(/\[/g, `{`);
  songList = JSON.stringify(songList).replace(/\]/g, `}`);
  songList = songList.replace(/\\/g, ``);
  songList = songList.substring(1, songList.length - 1);
  songList = `songList = ` + songList;

  // write to file
  fs.writeFileSync(outputFolder + `/` + name + `.json`, songList, { spaces: 2, EOL: `\r\n` }, function (err) {
    if (err) console.error(err);
  })
}



// function createEvent(time, instrument) {
//   if (time > 0) {
//     songList[line] = [time, [instrument]]; // create new event
//   }

//   for (let index in event.data) { // an 'in' loop gets you the index of an array, 'of' gets you the elements in the array
//     pitch = Math.round(event.data[index] / (127 / 24)); // pitch 0-127 mapping to pitch 0-24
//     songList[line][1].push(pitch) // add extra pitch to tone
//   }

//   line++;
// }