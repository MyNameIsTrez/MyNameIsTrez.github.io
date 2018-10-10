var xCar = 50; //Meest links boven
var yCar = 100; //Meest links boven
var xSize = 200;
var ySize = 180;
var wheelSize = 24;

function setup() {
  createCanvas(xSize, ySize);
  background(220);
}

function draw() {
    noStroke(); 
    fill(255, 220, 115); 
    rect(xCar, yCar, 110, 20); 
    rect(xCar + 10, yCar-22, 70, 40);
    // Wielen
    stroke(255); 
    strokeWeight(2);
    fill(12, 66, 66);
    ellipse(xCar + 25, yCar + 21, wheelSize, wheelSize); 
    ellipse(xCar + 80, yCar + 21, wheelSize, wheelSize);
    stroke(0); //Zwarte weg
    line(0, yCar + 21 + wheelSize/2, width, yCar + 21 + wheelSize/2); 
    //'width' is de breedte van je canvas
};
