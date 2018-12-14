// use 'node parseMidi.js' to execute

let fs = require('fs');
let midiParser = require('./midi-parser.js');

inputFolder = "./input"
outputFolder = "C:/Users/welfj/AppData/Roaming/.technic/modpacks/tekkit/saves/Creative-2/computer/2/"

names = fs.readdirSync(inputFolder);

for (i in names) {
  let name = names[i].replace(/\.[^/.]+$/, "");
  let data = fs.readFileSync('./input/' + name + '.mid', 'base64');
  var midiArray = midiParser.parse(data);
  let songList = [];
  let line = -1;

  for (track of midiArray.track) { // for every track
    for (event of track.event) { // for every event
      if (event.type === 9) { // if the event type is 'Note On'
        time = event.deltaTime / 17; // sleep between pitches
        // the instrument to play
        pitch = Math.round(event.data[0] / (127 / 24)); // pitch 0-127 map to 0-24
        if (time > 0) { // play pitches at the same time
          line++; // next tone
          songList[line] = [time, ['harp', pitch]]; // create new tone
        } else {
          if (line === 0) { // if this is the first line
            line++; // next tone
            songList[line] = [40, ['harp', pitch]]; // create new starting tone
          } else {
            songList[line][1].push(pitch) // add extra pitch to tone
          }
        }
      }
    }
  }
  // replace all '[]' with '{}' and add 'songList = ' to the beginning
  songList = JSON.stringify(songList).replace(/\[/g, '{');
  songList = JSON.stringify(songList).replace(/\]/g, '}');
  songList = songList.replace(/\\/g, '');
  songList = songList.substring(1, songList.length - 1);
  songList = 'songList = ' + songList;

  // write to file
  fs.writeFileSync(outputFolder + name + '.txt', songList, { spaces: 2, EOL: '\r\n' }, function (err) {
    if (err) console.error(err);
  })
}