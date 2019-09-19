function checkKeyIsDown() {
  if (keyIsDown(kbs.w) || keyIsDown(kbs.ArrowUp)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (player.y >= 1) player.y--;
    }
  }
  if (keyIsDown(kbs.a) || keyIsDown(kbs.ArrowLeft)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (player.x >= 1) player.x--;
    }
  }
  if (keyIsDown(kbs.s) || keyIsDown(kbs.ArrowDown)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (player.y <= rows * tileSize - 2) player.y++;
    }
  }
  if (keyIsDown(kbs.d) || keyIsDown(kbs.ArrowRight)) {
    for (let _ = 0; _ < player.speed; _++) {
      if (player.x <= cols * tileSize - 2) player.x++;
    }
  }
}