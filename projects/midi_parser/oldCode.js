  // getTrackNoteIndexes();
  // function getTrackNoteIndexes() {
  //   let trackNoteIndexes = [];
  //   // loop the length of trackIndexes, 5, times
  //   for (let index = 0; index < trackIndexes.length; index++) {
  //     // pick a new track from the largest to the smallest
  //     let track = midiArray.track[trackIndexes[index]];
  //     trackNoteIndexes.push([]);
  //     for (let event of track.event) { // for every event
  //       trackNoteIndexes[index].push(track.event.indexOf(event));
  //       // if (track.event.indexOf(event) > trackNoteIndexes[index]) {
  //       //   trackNoteIndexes[index] = track.event.indexOf(event);
  //       // }

  //       // if (track.findIndex(getIndexOfEventInTrack) > trackNoteIndexes[index]) {
  //       //   trackNoteIndexes[index] = track.findIndex(getIndexOfEventInTrack);
  //       // }

  //       // function getIndexOfEventInTrack(arg) {
  //       //   return arg === event;
  //       // }
  //     }
  //   }
  // }

  // // interlace the tracks
  // // loop the largest amount of note events a track has times, 4404 with Toto - Africa
  // for (let i = 0; i < tracksNoteCount[0]; i++) {
  //   // loop the length of trackIndexes, 5, times
  //   for (index = 0; index < trackIndexes.length; index++) {
  //     // pick a new track from the largest to the smallest
  //     let track = midiArray.track[trackIndexes[index]];
  //     // pick a new instrument that is based on the track index
  //     let instrument = instruments[index];
  //     for (let event of track.event) {
  //       // createEvent(event, Math.round(event.deltaTime / 20), instrument);
  //       createEvent(event, Math.round(event.deltaTime), instrument);
  //     }
  //   }
  // }