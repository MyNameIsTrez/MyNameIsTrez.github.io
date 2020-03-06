var farm_upgrade_level = 0;
var house_upgrade_level = 0;
var office_upgrade_level = 0;
var laboratory_upgrade_level = 0;
var windmill_upgrade_level = 0;
var uranium_mine_upgrade_level = 0;
var reactor_upgrade_level = 0;

let upgrades = { // name: cost, consumption multiplier, production multiplier
  farm: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ],
  house: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ],
  office: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ],
  laboratory: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ],
  windmill: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ],
  uranium_mine: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ],
  reactor: [
    [0, 1, 1], [100, 2, 2], [300, 3, 3], [1000, 4, 4]
  ]
}

function buyUpgrade() {
  // if the selected upgrade exists (lvl 4 doesn't exist)
  if (Number(selectedButton.upgrades.charAt(selectedButton.upgrades.length - 1)) !== 4) {
    // if the reactor_upgrade_level is 1 lower than the selected button and
    // if you've got enough money to buy the upgrade,
    // remove the amount of money that's equal to the upgrade price
    if (
      window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] ===
      (Number(selectedButton.upgrades.charAt(selectedButton.upgrades.length - 1)) - 1) &&
      money >= upgrades[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 2)][window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] + 1][0]
    ) {
      playSoundPurchase();
      money -= upgrades[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 2)][window[selectedButton.upgrades.substr(0, selectedButton.upgrades.length - 1) + 'upgrade_level'] + 1][0];

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
}