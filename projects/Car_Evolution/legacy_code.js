// // The block below checks if both corners of the line connect to already existing corners.
// // If this is the case the last two corners are removed, as they're not visible and clutter.
// // This wouldn't work, as each corner can currently only connect with one line,
// // so this code is only here for future-proofing.

// // The most recently placed two corners.
// recentCorner1 = corners[corners.length - 2];
// recentCorner2 = corners[corners.length - 1];

// // For every corner except for the most recently added two.
// for (let i = 0; i < corners.length - 3; i++) {
//   corner1 = corners[i];
//   // If one of the already existing corners is equal to the newly added two.
//   if (checkThreeCornersSame(corner1, recentCorner1, recentCorner2)) {
//     console.log(1)
//     // If two of the already existing corners are equal to the newly added two.
//     for (let j = 0; j < corners.length - 3; j++) {
//       corner2 = corners[j];
//       // Don't use corner1 as corner2.
//       if (corner1 !== corner2) {
//         if (checkThreeCornersSame(corner2, recentCorner1, recentCorner2)) {
//           // Remove the two newly added corners.
//           console.log(2);
//           console.log(corners);
//           corners.splice(corners.length - 2, 2);
//           console.log(corners);
//         }
//       }
//     }
//   }
// }



// function checkThreeCornersSame(a, b, c) {
//   if ((a.x === b.x || a.x === c.x) &&
//     (a.y === b.y || a.y === c.y)) {
//     return true;
//   }
// }


// class Button {

//   constructor(text, width, height) {
//     this.text = text;
//     this.width = width;
//     this.height = height;
//     this.x = innerWidth/2 - width/2;
//     this.y = innerHeight/3 - height/2;
//   }

//   draw() {
//     push();
//     fill(255);
//     rect(this.x, this.y, this.width, this.height);
//     fill(0);
//     // textSize();
//     text(this.text, this.x + this.width / 2, this.y + this.height / 2);
//     pop();
//   }

// }