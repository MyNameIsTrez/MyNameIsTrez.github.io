// use 'node outputMidi.js' in this folder to execute

let fs = require('fs');
let midiParser = require('./midi-parser.js');

inputFolder = "./input"
outputFolder = "./output/"

names = fs.readdirSync(inputFolder);

for (i in names) {
  let name = names[i].replace(/\.[^/.]+$/, "");
  let data = fs.readFileSync('./input/' + name + '.mid', 'base64');
  var midiArray = midiParser.parse(data);

  // write to file
  fs.writeFileSync(outputFolder + name + 'Midi' + '.json', JSON.stringify(midiArray), {
    spaces: 2,
    EOL: '\r\n'
  }, function (err) {
    if (err) console.error(err);
  })
}