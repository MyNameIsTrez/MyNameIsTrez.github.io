function setup() {
    createInstances();

    createCanvas(innerWidth, innerHeight);
        
    background(30);

    world.debugShowGrid();
}


function draw() {
    console.log(keyIsPressed)
    if (keyIsPressed) {
        continousKeyPressed();
        
        background(30);
    
        world.debugShowGrid();
    }
}


function createInstances() {
    world = new World();
}