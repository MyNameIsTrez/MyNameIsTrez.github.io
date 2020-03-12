function continousKeyPressed() {
    // console.log(key);

    switch(key) {
        case 'w':
            world.player.y -= 3;
            break;
        case 'a':
            world.player.x -= 3;
            break;
        case 's':
            world.player.y += 3;
            break;
        case 'd':
            world.player.x += 3;
            break;
    }
}