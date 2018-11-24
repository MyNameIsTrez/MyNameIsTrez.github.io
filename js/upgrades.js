let farm_upgrade_level = 0;
let house_upgrade_level = 0;
let office_upgrade_level = 0;
let laboratory_upgrade_level = 0;
let windmill_upgrade_level = 0;
let uranium_mine_upgrade_level = 0;
let reactor_upgrade_level = 0;

let upgrades = { // name: consumption multiplier, production multiplier, cost
  farm: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ],
  house: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ],
  office: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ],
  laboratory: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ],
  windmill: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ],
  uranium_mine: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ],
  reactor: [
    [1, 1], [2, 2, 100], [3, 3, 300], [4, 4, 1000]
  ]
}

function buyUpgrade(upgrade) {
  switch (upgrade) {
    case 'farm_1':
      if (farm_upgrade_level < 1 && money >= upgrades['farm'][1][2]) {
        farm_upgrade_level = 1;
      }
      break;
    case 'house_1':
      if (house_upgrade_level < 1 && money >= upgrades['house'][1][2]) {
        house_upgrade_level = 1;
      }
      break;
    case 'office_1':
      if (office_upgrade_level < 1 && money >= upgrades['office'][1][2]) {
        office_upgrade_level = 1;
      }
      break;
    case 'laboratory_1':
      if (laboratory_upgrade_level < 1 && money >= upgrades['laboratory'][1][2]) {
        laboratory_upgrade_level = 1;
      }
      break;
    case 'windmill_1':
      if (windmill_upgrade_level < 1 && money >= upgrades['windmill'][1][2]) {
        windmill_upgrade_level = 1;
      }
      break;
    case 'uranium_mine_1':
      if (uranium_mine_upgrade_level < 1 && money >= upgrades['uranium_mine'][1][2]) {
        uranium_mine_upgrade_level = 1;
      }
      break;
    case 'reactor_1':
      if (reactor_upgrade_level < 1 && money >= upgrades['reactor'][1][2]) {
        reactor_upgrade_level = 1;
      }
      break;

    case 'farm_2':
      if (farm_upgrade_level < 2 && money >= upgrades['farm'][2][2]) {
        farm_upgrade_level = 2;
      }
      break;
    case 'house_2':
      if (house_upgrade_level < 2 && money >= upgrades['house'][2][2]) {
        house_upgrade_level = 2;
      }
      break;
    case 'office_2':
      if (office_upgrade_level < 2 && money >= upgrades['office'][2][2]) {
        office_upgrade_level = 2;
      }
      break;
    case 'laboratory_2':
      if (laboratory_upgrade_level < 2 && money >= upgrades['laboratory'][2][2]) {
        laboratory_upgrade_level = 2;
      }
      break;
    case 'windmill_2':
      if (windmill_upgrade_level < 2 && money >= upgrades['windmill'][2][2]) {
        windmill_upgrade_level = 2;
      }
      break;
    case 'uranium_mine_2':
      if (uranium_mine_upgrade_level < 2 && money >= upgrades['uranium_mine'][2][2]) {
        uranium_mine_upgrade_level = 2;
      }
      break;
    case 'reactor_2':
      if (reactor_upgrade_level < 2 && money >= upgrades['reactor'][2][2]) {
        reactor_upgrade_level = 2;
      }
      break;

    case 'farm_3':
      if (farm_upgrade_level < 3 && money >= upgrades['farm'][3][2]) {
        farm_upgrade_level = 3;
      }
      break;
    case 'house_3':
      if (house_upgrade_level < 3 && money >= upgrades['house'][3][2]) {
        house_upgrade_level = 3;
      }
      break;
    case 'office_3':
      if (office_upgrade_level < 3 && money >= upgrades['office'][3][2]) {
        office_upgrade_level = 3;
      }
      break;
    case 'laboratory_3':
      if (laboratory_upgrade_level < 3 && money >= upgrades['laboratory'][3][2]) {
        laboratory_upgrade_level = 3;
      }
      break;
    case 'windmill_3':
      if (windmill_upgrade_level < 3 && money >= upgrades['windmill'][3][2]) {
        windmill_upgrade_level = 3;
      }
      break;
    case 'uranium_mine_3':
      if (uranium_mine_upgrade_level < 3 && money >= upgrades['uranium_mine'][3][2]) {
        uranium_mine_upgrade_level = 3;
      }
      break;
    case 'reactor_3':
      if (reactor_upgrade_level < 3 && money >= upgrades['reactor'][3][2]) {
        reactor_upgrade_level = 3;
      }
      break;
  }
}