// use `node parseMidi.js` to execute

let fs = require(`fs`);
let midiParser = require(`./midi-parser.js`);

let inputFolder = `./input`;
let outputFolder = `./output`;
// let outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;
// let outputFolder = `C:/Users/MML-INFORMATICA/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;

let names = fs.readdirSync(inputFolder);

let instruments = [`bass`, `snare`, `hat`, `bassdrum`, `harp`];

for (i in names) {
  let name = names[i].replace(/\.[^/.]+$/, ``);
  let data = fs.readFileSync(`./input/` + name + `.mid`, `base64`);
  var midiArray = midiParser.parse(data);
  var songList = [];
  var line = 0;

  let instrumentIndex = 2; // changes which instruments play which track

  for (track of midiArray.track) { // for every track, max of 5 tracks with 5 noteblock instruments
    let instrument = instruments[instrumentIndex++ % instruments.length]; // pick a new instrument

    for (event of track.event) { // for every event
      if (event.type === 9) { // if the event type is `Note On`
        let time = event.deltaTime / 20; // sleep between pitches

        if (line === 0) { // if this is the first line, have a delay
          createEvent(40, instrument);
        } else { // create a new event/add onto an existing event
          createEvent(time, instrument);
        }
      }
    }
  }

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

function createEvent(time, instrument) {
  if (time > 0) {
    songList[line] = [time, [instrument]]; // create new event
  }

  for (i in event.data) { // an 'in' loop gets you the index of an array, 'of' gets you the elements in the array
    pitch = Math.round(event.data[i] / (127 / 24)); // pitch 0-127 mapping to pitch 0-24
    songList[line][1].push(pitch) // add extra pitch to tone
  }

  line++;
}