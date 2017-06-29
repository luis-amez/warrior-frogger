//  This file provides the game loop functionality (update entities and render)
var Engine = (function(global) {
  // Creates the canvas element, set its width and heigh and append it to the DOM
  var doc = global.document;
  var win = global.window;
  var canvas = doc.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var lastTime;

  canvas.width = 707;
  canvas.height = 707;
  doc.body.appendChild(canvas);

  // Starts the loop
  function main() {
    // Delta time for smooth animation regardless computer speed
    var now = Date.now(),
    dt = (now - lastTime) / 1000.0;

    // Update and render invocation
    updateElements(dt);
    render();

    lastTime = now;

    // Invocation of main as soon as the browser is able to draw another frame, continues the loop
    win.requestAnimationFrame(main);
  }

  // Initial setup
  function init() {
    lastTime = Date.now();
    main();
  }

  // Updates every element in the game
  function updateElements(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
    potionPoints.update();
    potionHealth.update();
  }

  // Draws the board game
  function render() {
    // Array with paths to tiles images
    var rowImages = [
      'images/path-safe.png',   // Top row is safe
      'images/path-danger.png',   // Row 1 of 5 of dangerous
      'images/path-danger.png',   // Row 2 of 5 of dangerous
      'images/path-danger.png',   // Row 3 of 5 of dangerous
      'images/path-danger.png',   // Row 4 of 5 of dangerous
      'images/path-danger.png',   // Row 5 of 5 of dangerous
      'images/path-safe.png'    // Bottom row is safe
    ];
    var numRows = 7;
    var numCols = 7;

    // Loops for the rows and cols drawing the tiles
    for (var row = 0; row < numRows; row++) {
      for (var col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  // Draws the game's elements
  function renderEntities() {
    allEnemies.forEach(function(enemy) {
        enemy.render();
    });

    player.render();
    potionPoints.render();
    potionHealth.render();
  }

  // Load all the images an start the game when it's done
  Resources.load([
    'images/path-safe.png',
    'images/path-danger.png',
    'images/ghost-regular.png',
    'images/warrior-frogger.png',
    'images/potion-health.png',
    'images/potion-points.png'
  ]);
  Resources.onReady(init);

  // Assign the context to the global variable for scoope purposes
  global.ctx = ctx;
})(this);
