class Chunk {
    constructor(xChunk, yChunk) {        
        this.initTiles();
    }

    initTiles() {
        this.tiles = [];

        for (let xTile = 0; xTile < 16; xTile++) {
            this.tiles[xTile] = [];

            for (let yTile = 0; yTile < 16; yTile++) {
                this.tiles[xTile][yTile] = new Tile(xTile, yTile);
            }
        }

        // console.log(JSON.stringify(this.tiles, undefined, 4));
    }
}