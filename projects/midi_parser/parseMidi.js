// use `node parseMidi.js` to execute

let fs = require(`fs`);
let midiParser = require(`./midi-parser.js`);

let inputFolder = `./input`;
// let outputFolder = `./output`;
let outputFolder = `C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2`;

let names = fs.readdirSync(inputFolder);

let instruments = [`bass`, `snare`, `hat`, `bassdrum`, `harp`];

for (i in names) {
  let name = names[i].replace(/\.[^/.]+$/, ``);
  let data = fs.readFileSync(`./input/` + name + `.mid`, `base64`);
  var midiArray = midiParser.parse(data);
  let songList = [];
  let line = -1;
  let instrumentIndex = 2;

  for (track of midiArray.track) { // for every track, max of 5 tracks
    let instrument = instruments[instrumentIndex++ % instruments.length]; // pick a new instrument

    for (event of track.event) { // for every event
      if (event.type === 9) { // if the event type is `Note On`
        time = event.deltaTime / 100; // sleep between pitches
        pitch = Math.round(event.data[0] / (127 / 24)); // pitch 0-127 mapping to pitch 0-24

        if (time > 0) { // play pitches at the same time
          songList[++line] = [time, [instrument, pitch]]; // create new tone
        } else {
          if (line === 0) { // if this is the first line
            songList[++line] = [40, [instrument, pitch]]; // create new starting tone
          } else { // 
            pitch = Math.round(event.data[1] / (127 / 24)); // pitch 0-127 mapping to pitch 0-24
            songList[line][1].push(pitch) // add extra pitch to tone
          }
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
  fs.writeFileSync(outputFolder + `/` + name + `.txt`, songList, { spaces: 2, EOL: `\r\n` }, function (err) {
    if (err) console.error(err);
  })
}