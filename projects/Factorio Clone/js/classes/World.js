class World {
    constructor() {
        this.player = new Player();
        this.createGrid();
    }

    createGrid() {
        this.grid = {};

        const rd = this.player.renderDistance;

        for (let xChunk = -rd; xChunk <= rd; xChunk++) {
            this.grid[xChunk] = {};

            for (let yChunk = -rd; yChunk <= rd; yChunk++) {
                this.grid[xChunk][yChunk] = new Chunk(xChunk, yChunk);
            }
        }

        // console.log(this.grid);
        // console.log(JSON.stringify(this.grid, undefined, 4));
    }

    debugShowGrid() {
        push();

        // let visibleChunkCount = 0;
        
        for (const [ xChunk, a ] of Object.entries(this.grid)) {
            for (const [ yChunk, _ ] of Object.entries(a)) {
                const xCanvas = xCanvasMiddle + xChunk * chunkPxLength - this.player.x;
                const yCanvas = yCanvasMiddle + yChunk * chunkPxLength - this.player.y;

                // Not sure if >= or > and <= or < should be used
                const inCanvas =
                    xCanvas >= -chunkPxLength &&
                    xCanvas <   innerWidth    && 
                    yCanvas >= -chunkPxLength && 
                    yCanvas <   innerHeight   ;
                
                // if (inCanvas) {
                //     visibleChunkCount++;
                // }

                if (inCanvas) {
                    stroke(255);
                    strokeWeight(5);
                    noFill();

                    square(xCanvas, yCanvas, chunkPxLength);
                    
                    const string = xChunk + ', ' + yChunk;
                    const xText = xCanvas + chunkPxLength/2;
                    const yText = yCanvas + chunkPxLength/2;

                    textAlign(CENTER);
                    fill(255);
                    textSize(20);
                    stroke(0);
                    strokeWeight(2);
                    
                    text(string, xText, yText);
                }
            }
        }
        
        pop();

        push();

        // const string = 'visibleChunkCount: ' + visibleChunkCount;

        let chunkCount = 0;
        for (const a of Object.values(this.grid)) {
            for (const _ of Object.values(a)) {
                chunkCount++;
            }
        }
        
        const string = 'chunkCount: ' + chunkCount;
        const xText = 30;
        const yText = 50;

        fill(255);
        textSize(30);
        stroke(0);
        strokeWeight(2);

        text(string, xText, yText)

        pop();
    }
}