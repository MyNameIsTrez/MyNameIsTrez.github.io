// Implementation of the code from this tutorial:
// https://youtu.be/9A5TVh6kPLA

function setup() {
  createCanvas(400, 400);
  background(30);

  stroke(255);

  const vertices = [
    createVector(0, height),
    createVector(width, height / 3),
    createVector(width / 2, 0),
  ];

  drawFilledTriangle(vertices);
}

function drawFilledTriangle(vertices) {
  // Sort vertices, so v0.y <= v1.y <= v2.y.
  vertices.sort((a, b) => a.y - b.y);

  let v0 = vertices[0];
  let v1 = vertices[1];
  let v2 = vertices[2];
  
  if (v0.y === v1.y) { // Natural flat top.
    // Sort so v0 is on the left of v1.
    if (v1.x < v0.x) {
      const _v0 = v0;
      v0 = v1;
      v1 = _v0;
    }
    drawFlatTopTriangle(v0, v1, v2);
  } else if (v1.y === v2.y) { // Natural flat bottom.
    // Sort so v1 is on the left of v2.
    if (v2.x < v1.x) {
      const _v1 = v1;
      v1 = v2;
      v2 = _v1;
    }
    drawFlatBottomTriangle(v0, v1, v2);
  } else { // General triangle.
    console.log(3);
    // Find splitting vertex.
    const alphaSplit = (v1.y - v0.y) / (v2.y - v0.y);
    // vi = v0 + (v2 - v0) * alphaSplit
    const vi = p5.Vector.add(v0, p5.Vector.mult(p5.Vector.sub(v2, v0), alphaSplit));
    
    if (v1.x < vi.x) { // Major right.
      drawFlatBottomTriangle(v0, v1, vi);
      drawFlatTopTriangle(v1, vi, v2);
    } else { // Major left.
      drawFlatBottomTriangle(v0, vi, v1);
      drawFlatTopTriangle(vi, v1, v2);
    }
  }
}

function drawFlatTopTriangle(v0, v1, v2) {
  // Calculate inverse slopes of left and right lines.
  // Note it's dx/dy, not dy/dx, to prevent div by 0.
  // This works, because there are no perfectly horizontal lines for the left and right triangle edges.
  const m0 = (v2.x - v0.x) / (v2.y - v0.y);
  const m1 = (v2.x - v1.x) / (v2.y - v1.y);
  
  // Calculate start and end scanline y values as ints.
  // Top part of the top-left rule.
  // The difference between ceil(n-0.5) and round(n) is that ceil(1.5-0.5) === 1, while round(1.5) === 2, but not sure if round() could be used instead.
  const yStart = ceil(v0.y - 0.5);
  const yEnd = ceil(v2.y - 0.5); // The scanline AFTER the last line drawn.
  
  for(let y = yStart; y < yEnd; y++) {
    // Calculate start and end points (x-coords).
    // Add 0.5 to y value because we're calculating based on pixel CENTERS.
    const px0 = m0 * (y + 0.5 - v0.y) + v0.x;
    const px1 = m1 * (y + 0.5 - v1.y) + v1.x;
    
    // Calculate start and end pixels.
    // Left part of the top-left rule.
    const xStart = ceil(px0 - 0.5);
    const xEnd = ceil(px1 - 0.5); // The pixel AFTER the last pixel drawn.
    
    for(let x = xStart; x < xEnd; x++) {
      point(x, y);
    }
  }
}

function drawFlatBottomTriangle(v0, v1, v2) {
  const m0 = (v1.x - v0.x) / (v1.y - v0.y);
  const m1 = (v2.x - v0.x) / (v2.y - v0.y);
  
  const yStart = ceil(v0.y - 0.5);
  const yEnd = ceil(v2.y - 0.5);
  
  for(let y = yStart; y < yEnd; y++) {
    const px0 = m0 * (y + 0.5 - v0.y) + v0.x;
    const px1 = m1 * (y + 0.5 - v0.y) + v0.x;
    
    const xStart = ceil(px0 - 0.5);
    const xEnd = ceil(px1 - 0.5);
    
    for(let x = xStart; x < xEnd; x++) {
      point(x, y);
    }
  }
}