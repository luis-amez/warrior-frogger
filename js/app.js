// Global variables
var constants = {
  MAX_ROWS: 7,
  MAX_COLS: 7,
  X_SIDE: 101,
  Y_SIDE: 83,
  Y_START_PLAYER: 72,
  Y_START_ENEMY: 62,
  Y_START_ITEM: 52
};

// Ghosts that haunt our warrior,
// Parameter: yRow, the row where they appear
var Enemy = function(yRow) {
  this.x = - 3 * constants.X_SIDE;
  this.y = yRow;
  this.speed = this.getRandomSpeed();
  this.sprite = 'images/ghost-regular.png';
};

// Set a different speed (between 150 and 600) for each enemy's ride
Enemy.prototype.getRandomSpeed = function() {
  return Math.random() * 450 + 150;
};

// Update the ghosts' position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.x >= (constants.MAX_COLS + 2) * constants.X_SIDE) {
    this.x = - 3 * constants.X_SIDE;
    this.speed = this.getRandomSpeed();
  } else {
    this.x += this.speed * dt;
  }
};

// Draw the ghosts on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Our brave warrior, Calvino
var Player = function() {
  this.newGame();
  this.sprite = 'images/warrior-frogger.png';
};

// Update the warrior's position
Player.prototype.update = function() {
  // Warrior reachs goal
  if (this.y < -constants.Y_SIDE) {
    this.x = Math.floor(constants.MAX_COLS / 2) * constants.X_SIDE;
    this.y = constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE;
    this.score += 100;
    potionPoints.appear();
    potionHealth.appear();
  }
  // Warrior hits a ghost
  allEnemies.forEach(function(enemy) {
    if (this.y - constants.Y_START_PLAYER === enemy.y - constants.Y_START_ENEMY && (this.x > enemy.x - constants.X_SIDE / 1.75 && this.x < enemy.x + constants.X_SIDE / 1.75)) {
      this.x = Math.floor(constants.MAX_COLS / 2) * constants.X_SIDE;
      this.y = constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE;
      this.lives --;

    }
  }.bind(this));
  // Warrior has 0 lives, hide player
  if (this.lives <= 0) {
    this.x = - constants.X_SIDE;
  }
};

// Draw the warrior on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.font = "21pt sans-serif";
  ctx.lineWidth = 1;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillRect(0, 0, 707, 40);
  ctx.strokeText("Score: " + this.score, 30, 30);
  ctx.strokeText("Lives: " + this.lives, 570, 30);
  // Warrior has 0 lives, write message
  if (this.lives <= 0) {
    ctx.font = "63pt sans-serif";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";
    ctx.strokeText("Game Over!", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75);
    ctx.fillText("Game Over!", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75);
    ctx.font = "28pt sans-serif";
    ctx.strokeText("Pres any key to start a new game.", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75 + 60);
    ctx.fillText("Pres any key to start a new game.", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75 + 60);
  }
};

// Move the warrior across the screen
Player.prototype.handleInput = function(key) {
  if (this.lives > 0) {
    switch (key) {
      case 'left':
        if (this.x > 0) {
          this.x -= constants.X_SIDE;
        }
        break;
      case 'up':
        if (this.y > -constants.Y_SIDE) {
          this.y -= constants.Y_SIDE;
        }
        break;
      case 'right':
        if (this.x < (constants.MAX_COLS - 1) * constants.X_SIDE) {
          this.x += constants.X_SIDE;
        }
        break;
      case 'down':
        if (this.y < constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE) {
          this.y += constants.Y_SIDE;
        }
        break;
    }
  // Warrior has 0 lives, start new game
  } else {
    this.newGame();
  }
};

// Start new game
Player.prototype.newGame = function() {
  this.x = Math.floor(constants.MAX_COLS / 2) * constants.X_SIDE;
  this.y = constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE;
  this.lives = 3;
  this.score = 0;
};

// Items our warrior can take
var Item = function() {

};

// Draw the item on the screen
Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Show an item according to its probability
Item.prototype.appear = function() {
  if (this.prob >= Math.random()) {
    this.x = this.getRandomLocation(constants.MAX_COLS, constants.X_SIDE, 0);
    this.y = this.getRandomLocation(constants.MAX_ROWS - 2, constants.Y_SIDE, constants.Y_START_ITEM);
  }
};

// Set a different location for each item
Item.prototype.getRandomLocation = function(max, side, start) {
  return (Math.floor(Math.random() * max)) * side + start;
};

// Potion that gives points to the Warrior
var PotionPoints = function() {
  this.prob = 1/3;
  this.sprite = 'images/potion-points.png';
};
// PotionPoints is a subclass of Item
PotionPoints.prototype = Object.create(Item.prototype);
// Retrieving PotionPoints's constructor
PotionPoints.prototype.constructor = PotionPoints;

// Update the potionPoints's position
PotionPoints.prototype.update = function() {
  // Warrior drinks the potionPoints
  if (player.y - constants.Y_START_PLAYER === this.y - constants.Y_START_ITEM && player.x === this.x) {
    this.y = - 3 * constants.Y_SIDE;
    player.score += 500;
  }
};

// Potion that gives one more life to the Warrior
var PotionHealth = function() {
  this.prob = 1/10;
  this.sprite = 'images/potion-health.png';
};
// PotionHealth is a subclass of Item
PotionHealth.prototype = Object.create(Item.prototype);
// Retrieving PotionHealth's constructor
PotionHealth.prototype.constructor = PotionHealth;

// Update potionHealth's position
PotionHealth.prototype.update = function() {
  // Player drinks the potionHealth
  if (player.y - constants.Y_START_PLAYER === this.y - constants.Y_START_ITEM && player.x === this.x) {
    this.y = - 3 * constants.Y_SIDE;
    player.lives ++;
  }
};

// Declaration of all the ghosts. They are stored into an array
var enemyA1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 4);
var enemyA2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 4);
var enemyB1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 3);
var enemyB2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 3);
var enemyC1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 2);
var enemyC2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 2);
var enemyD1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 1);
var enemyD2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 1);
var enemyE1 = new Enemy(constants.Y_START_ENEMY);
var enemyE2 = new Enemy(constants.Y_START_ENEMY);
var allEnemies = [enemyA1, enemyA2, enemyB1, enemyB2, enemyC1, enemyC2, enemyD1, enemyD2, enemyE1, enemyE2];
// Declaration of our warrior
var player = new Player();
// Declaration of the potions
var potionPoints = new PotionPoints();
var potionHealth = new PotionHealth();

// Listener for key input
document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
