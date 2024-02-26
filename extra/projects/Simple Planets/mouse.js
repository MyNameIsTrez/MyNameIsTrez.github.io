function mousePressed() {
	if (mouseX < width && mouseY < height) {
		checkClickedButton();

		// check if double-clicking
		currentTime = millis(); // millis() returns 12 decimals which 
		const elapsedTime = currentTime - previousTime;
		previousTime = currentTime;

		const samePos = previousMouseX === mouseX && previousMouseY === mouseY;
		if (elapsedTime < 250 && samePos) {
			startSimulation();
		} else {
			if (attractors.length) {
				for (const i in attractors) {
					const attractor = attractors[i];
					xDiff = mouseX - attractor.pos.x;
					yDiff = mouseY - attractor.pos.y;
					const dist = sqrt(xDiff * xDiff + yDiff * yDiff);
					if (dist <= attractorRadius) {
						// removes the attractor
						if (particleEffect === "path") {
							attractor.show(backgroundColor);
						}
						return attractors.splice(i, 1);
					}
				}
				// add attractor, can only be reached if no attractor was removed
				attractors.push(new Attractor(mouseX, mouseY, attractorRadius, attractorMass));
			} else {
				attractors.push(new Attractor(mouseX, mouseY, attractorRadius, attractorMass));
				return;
			}
		}
		previousMouseX = mouseX;
		previousMouseY = mouseY;
	}
}
