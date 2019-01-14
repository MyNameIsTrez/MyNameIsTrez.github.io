/*
function getTrackNoteIndexes() {
  let trackNoteIndexes = [];
  // loop the length of trackIndexes, 5, times
  for (let index = 0; index < trackIndexes.length; index++) {
    // pick a new track from the largest to the smallest
    let track = midi.track[trackIndexes[index]];
    trackNoteIndexes.push([]);
    for (let event of track.event) { // for every event
      trackNoteIndexes[index].push(track.event.indexOf(event));
      // if (track.event.indexOf(event) > trackNoteIndexes[index]) {
      //   trackNoteIndexes[index] = track.event.indexOf(event);
      // }

      // if (track.findIndex(getIndexOfEventInTrack) > trackNoteIndexes[index]) {
      //   trackNoteIndexes[index] = track.findIndex(getIndexOfEventInTrack);
      // }

      // function getIndexOfEventInTrack(arg) {
      //   return arg === event;
      // }
    }
  }
}

// interlace the tracks
// loop the largest amount of note events a track has times, 4404 with Toto - Africa
for (let i = 0; i < tracksNoteCount[0]; i++) {
  // loop the length of trackIndexes, 5, times
  for (index = 0; index < trackIndexes.length; index++) {
    // pick a new track from the largest to the smallest
    let track = midi.track[trackIndexes[index]];
    // pick a new instrument that is based on the track index
    let instrument = instruments[index];
    for (let event of track.event) {
      // createEvent(event, Math.round(event.deltaTime / 20), instrument);
      createEvent(event, Math.round(event.deltaTime), instrument);
    }
  }
}

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
      midiArray[line] = [time, [instrument]];
      lineOne = true;
    } else {
      // create a new event
      midiArray[++line] = [time, [instrument]];
    }
  }

  for (let index in event.data) {
    // pitch 0-127 to pitch 0-24
    // pitch = Math.round(event.data[index] * (24 / 127));

    // pitch 0-127 to pitch 0-24
    pitch = Math.round(event.data[index]);

    // add extra pitch to tone
    midiArray[line][1].push(pitch)
  }
}

// write to file
fs.writeFileSync(outputFolder + name + `.json`, midiArray, {
  spaces: 2,
  EOL: `\r\n`
}, function (err) {
  if (err) console.error(err);
})
*/