class WaveManager {
  constructor() {
    this.wave = 0;
    this.enemies = [];
    this.enemyCount = 1;
  }

  newWave() {
    this.wave++;
    this.createEnemies();
  }

  createEnemies() {
    const randomSpawns = this.getRandomEnemySpawns(this.enemyCount);
    for (let i = 0; i < this.enemyCount; i++) {
      this.enemies.push(new Enemy(randomSpawns[i][0], randomSpawns[i][1], i));
    }
    // It's necessary to call the pathfinding function once,
    // so getPathFromEnemyToPlayer() doesn't fail in app.js.
    for (const enemy of this.enemies) {
      enemy.pathfind(tileContainsPlayer);
    }
    // newWaveCreationComplete = true;
  }

  getRandomEnemySpawns(enemyCount) {
    let randomSpawns = [];
    for (let i = 0; i < enemyCount; i++) {
      const r = floor(random() * enemySpawns.length);
      const spawn = enemySpawns.splice(r, 1)[0];
      randomSpawns.push(spawn);
    }
    return randomSpawns;
  }
}