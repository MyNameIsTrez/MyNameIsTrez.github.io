function checkKeyIsDown() {
  if (keyIsDown(kbs.w) || keyIsDown(kbs.ArrowUp)) {
    for (let i = 0; i < player.speed; i++) {
      if (player.y >= 1) player.y--;
    }
  }
  if (keyIsDown(kbs.a) || keyIsDown(kbs.ArrowLeft)) {
    for (let i = 0; i < player.speed; i++) {
      if (player.x >= 1) player.x--;
    }
  }
  if (keyIsDown(kbs.s) || keyIsDown(kbs.ArrowDown)) {
    for (let i = 0; i < player.speed; i++) {
      if (player.y <= rows * size - 2) player.y++;
    }
  }
  if (keyIsDown(kbs.d) || keyIsDown(kbs.ArrowRight)) {
    for (let i = 0; i < player.speed; i++) {
      if (player.x <= cols * size - 2) player.x++;
    }
  }
}