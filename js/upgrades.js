var farm_upgrade_level = 0;
var house_upgrade_level = 0;
var office_upgrade_level = 0;
var laboratory_upgrade_level = 0;
var windmill_upgrade_level = 0;
var uranium_mine_upgrade_level = 0;
var reactor_upgrade_level = 0;

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

function buyUpgrade() {
  // if the reactor_upgrade_level is 1 lower than the selected button and
  // if you've got enough money to buy the upgrade,
  // remove the amount of money that's equal to the upgrade price

  if (
    window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] ===
    (Number(selectedButton.upgrades.charAt(selectedButton.upgrades.length - 1)) - 1) &&
    money >= upgrades[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 2)][window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] + 1][2]
  ) {
    money -= upgrades[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 2)][window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] + 1][2];

    // increase the building's upgrade level by 1 
    window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] =
      Number(selectedButton.upgrades.charAt(selectedButton.upgrades.length - 1));

    // increase the selectedButton's building level by 1
    if (Number(selectedButton.upgrades.charAt(selectedButton.upgrades.length - 1)) < 3) {
      selectedButton.upgrades = selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) +
        (Number(selectedButton.upgrades.charAt(selectedButton.upgrades.length - 1)) + 1);
    }
  }
}