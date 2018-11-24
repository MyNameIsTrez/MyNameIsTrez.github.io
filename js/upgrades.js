let farm_upgrade_level = 0;
let house_upgrade_level = 0;
let office_upgrade_level = 0;
let laboratory_upgrade_level = 0;
let windmill_upgrade_level = 0;
let uranium_mine_upgrade_level = 0;
let reactor_upgrade_level = 0;

let upgrades = { // name: level: cost
  farm: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ],
  house: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ],
  office: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ],
  laboratory: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ],
  windmill: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ],
  uranium_mine: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ],
  reactor: [
    [1, 0], [2, 100], [3, 300], [4, 1000]
  ]
}

function buyUpgrade(upgrade) {
  switch (upgrade) {
    case 'farm_1':
      console.log('farm_1');
      farm_upgrade_level = 1;
      break;
    case 'house_1':
      console.log('house_1');
      house_upgrade_level = 1;
      break;
    case 'office_1':
      console.log('office_1');
      office_upgrade_level = 1;
      break;
    case 'laboratory_1':
      console.log('laboratory_1');
      laboratory_upgrade_level = 1;
      break;
    case 'windmill_1':
      console.log('windmill_1');
      windmill_upgrade_level = 1;
      break;
    case 'uranium_mine_1':
      console.log('uranium_mine_1');
      uranium_mine_upgrade_level = 1;
      break;
    case 'reactor_1':
      console.log('reactor_1');
      reactor_upgrade_level = 1;
      break;

    case 'farm_2':
      console.log('farm_2');
      farm_upgrade_level = 2;
      break;
    case 'house_2':
      console.log('house_2');
      house_upgrade_level = 2;
      break;
    case 'office_2':
      console.log('office_2');
      office_upgrade_level = 2;
      break;
    case 'laboratory_2':
      console.log('laboratory_2');
      laboratory_upgrade_level = 2;
      break;
    case 'windmill_2':
      console.log('windmill_2');
      windmill_upgrade_level = 2;
      break;
    case 'uranium_mine_2':
      console.log('uranium_mine_2');
      uranium_mine_upgrade_level = 2;
      break;
    case 'reactor_2':
      console.log('reactor_2');
      reactor_upgrade_level = 2;
      break;

    case 'farm_3':
      console.log('farm_3');
      farm_upgrade_level = 3;
      break;
    case 'house_3':
      console.log('house_3');
      house_upgrade_level = 3;
      break;
    case 'office_3':
      console.log('office_3');
      office_upgrade_level = 3;
      break;
    case 'laboratory_3':
      console.log('laboratory_3');
      laboratory_upgrade_level = 3;
      break;
    case 'windmill_3':
      console.log('windmill_3');
      windmill_upgrade_level = 3;
      break;
    case 'uranium_mine_3':
      console.log('uranium_mine_3');
      uranium_mine_upgrade_level = 3;
      break;
    case 'reactor_3':
      console.log('reactor_3');
      reactor_upgrade_level = 3;
      break;
  }
}