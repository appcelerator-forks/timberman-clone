var Queue = require('Queue');

var queue = new Queue();

// Possible positions for branch creation / player positioning
var Position = {
	left : 0,
	right : 1,
	middle : 2,
};

// Boolean to see when the first chop happens to start the game
var isNewGame;

// Adapt game to screen size
var rotate180 = Ti.UI.create2DMatrix().rotate(180);
var rowHeight = Math.floor(Titanium.Platform.displayCaps.platformHeight / 
	Alloy.Globals.numberOfTreeSections);
var gridHeight = OS_IOS ? rowHeight * (Alloy.Globals.numberOfTreeSections - 1) : PixelsToDPUnits(rowHeight * (Alloy.Globals.numberOfTreeSections - 1));
var columnWidth = OS_IOS ? Titanium.Platform.displayCaps.platformWidth / 3 : PixelsToDPUnits(Titanium.Platform.displayCaps.platformWidth / 3);
var playerPosOffset = columnWidth * 2;
if (!OS_IOS) 
	rowHeight = PixelsToDPUnits(rowHeight);

// Initialize grid size in proportion to grid size
$.grid.setHeight((gridHeight)+'dp');
$.grid.setTransform(rotate180);

// Place tree stump
$.middleStump.setTop(gridHeight+'dp');
$.leftStump.setTop(gridHeight+'dp');
$.rightStump.setTop(gridHeight+'dp');
$.middleStump.setHeight((rowHeight / 3)+'dp');
$.leftStump.setHeight((rowHeight / 3)+'dp');
$.rightStump.setHeight((rowHeight / 3)+'dp');
$.rightStump.setLeft(columnWidth * 2);
$.leftStump.setRight(columnWidth * 2);
$.middleStump.setWidth(columnWidth);
$.leftStump.setWidth(columnWidth / 3);
$.rightStump.setWidth(columnWidth / 3);

// Create soil
$.soil.setTop(gridHeight + rowHeight / 3);

// Create hp bar
var maxHealthBar = Ti.UI.createView({
	top: '40dp',
	height: '30dp',
	width: '200dp',
	borderWidth: '1dp',
	borderColor: '#4f4f4f',
	backgroundColor: '#dddddd'
});
Alloy.Globals.healthBar = Ti.UI.createView({
	left: '0dp',
	height: Ti.UI.FILL,
	width: (Alloy.Globals.health / Alloy.Globals.maxHealth * 200)+'dp',
	backgroundColor: 'red'
});

maxHealthBar.add(Alloy.Globals.healthBar);
$.gameView.add(maxHealthBar);

// Initialize score and level
var score;
var level;
$.scoreLabel.setTop((rowHeight * 2)+'dp');
$.levelUpLabel.setTop(((rowHeight * 2) - 35)+'dp');

// Initialize character size in proportion to screen size
$.player.setHeight((rowHeight * 1.5)+'dp');
$.player.setWidth((columnWidth / 2)+'dp');
$.player.setBottom((rowHeight * 0.5)+'dp');

// Run game setup
newGameSetup();

$.leftChopButton.addEventListener('touchstart', function() {
	checkIfNewGame();
	if ($.player.pos == 1) {
		$.player.pos = 0;
		$.player.setLeft(undefined);
		$.player.setRight(playerPosOffset);
		$.player.setBackgroundImage('/woodpecker_left.png');
	}
	chopTree(Position.left);
});

$.rightChopButton.addEventListener('touchstart', function() {
	checkIfNewGame();
	if ($.player.pos == 0) {
		$.player.pos = 1;
		$.player.setRight(undefined);
		$.player.setLeft(playerPosOffset);
		$.player.setBackgroundImage('/woodpecker_right.png');
	}
	chopTree(Position.right);
});

Ti.App.addEventListener('gameOver', function() {
	alert('GAME OVER');
	newGameSetup();
});

/*
 * function newGameSetup()
 * 
 * Run every time a new game is started.
 * 
 */
function newGameSetup() {
	// Reset new game flag
	isNewGame = true;
	
	// Set background
	var background = getRandomInt(0, 2);
	if (background == 0) 
		$.background.backgroundImage = "/bg1.png";
	else if (background == 1)
		$.background.backgroundImage = "/bg2.png";
	else if (background == 2)
		$.background.backgroundImage = "/bg3.png";
		
	// Clear tree
	while (queue.getLength() > 0) {
		queue.dequeue();
		var rows = $.grid.getChildren();
		$.grid.remove(rows[0]);
	}
	
	// Player starting pos
	// $.player.setLeft(playerPosOffset+'dp');
	$.player.pos = 0;
	$.player.setLeft(undefined);
	$.player.setRight(playerPosOffset);
	$.player.setBackgroundImage('/woodpecker_left.png');
	
	// Reset score to 0
	score = 0;
	updateScore();
	
	// Reset level to 1
	level = 1;
	
	// Add a right branch to prevent a tree branch from killing the player
	// at the start of the game
	addRow(getRandomInt(1,2));
	while (queue.getLength() < (Alloy.Globals.numberOfTreeSections - 1)) {
		addRow(getRandomInt(0,2));
	}
}

/*
 * function addRow(type)
 * 
 * Adds a new row (tree section) to the grid (tree) of the specified
 * type.
 * 
 * Parameters:
 *  type: Can be one of Position.left, Position.middle, or Position.right
 * 
 */
function addRow(type) {
	var branchType = getRandomInt(1, 2);
	var row = Ti.UI.createView({
		height: rowHeight+'dp',
		layout: 'horizontal',
	});
	// Populate row
	for (var i = 0; i < 3; i++) {
		var box = Ti.UI.createView({
			height: rowHeight+'dp',
			width: columnWidth+'dp',
		});
		// Right box
		if (i == 0) {
			if (type == Position.right) {
				// Add branch
				// box.backgroundColor = 'black';
				box.backgroundImage = "/left_branch_"+branchType+".png";
			}
			else {
				// Add blank
				box.backgroundColor = 'transparent';
			}
		}
		// Middle box
		else if (i == 1) {
			// Add trunk
			box.backgroundColor = '#513300';
			// box.backgroundImage = "/trunk.png";
		}
		// Left box
		else if (i == 2) {
			if (type == Position.left) {
				// Add branch
				// box.backgroundColor = 'black';
				box.backgroundImage = "/right_branch_"+branchType+".png";
			}
			else {
				// Add blank
				box.backgroundColor = 'transparent';
			}
		}
		row.add(box);
	}
	// Add row type to queue
	queue.enqueue(type);
	// Add next row to grid
	$.grid.add(row);
	if (type == Position.left || type == Position.right) {
		// Add a mandatory blank to prevent a guaranteed death if a branch
		// was created
		addRow(Position.middle);
	}
}

function checkIfNewGame() {
	if (isNewGame) {
		Ti.API.info('Game Start, health: '+Alloy.Globals.health);
		isNewGame = false;
		// Fire start game event
		Ti.App.fireEvent('gameStart');
	}
}

/*
 * function chopTree(playerPos)
 * 
 * Called when a player taps the left section or the right section of the 
 * screen.
 * 
 * Parameters: 
 * 	playerPos: Which side the player is chopping the tree from. Can either 
 *   be Position.left or Position.right (0 or 1)
 * 
 */
function chopTree(playerPos) {
	var poppedRow = queue.dequeue();
	var nextRow = queue.peek();
	Ti.API.error('pop: '+poppedRow);
	if (queue.getLength() < (Alloy.Globals.numberOfTreeSections - 1)) {
		addRow(getRandomInt(0, 2));
	}
	var rows = $.grid.getChildren();
	$.grid.remove(rows[0]);
	Ti.API.error('queue length: '+queue.getLength());
	if (nextRow == playerPos) {
		// Game over, player is crushed by branch
		Ti.App.fireEvent('gameOver');
	}
	else { 
		score++;
		updateScore();
		if (Alloy.Globals.health <= Alloy.Globals.maxHealth - 2500)
			Alloy.Globals.health += 2500;
		else
			Alloy.Globals.health = Alloy.Globals.maxHealth;
		// Level up
		if ((score % 20) == 0) {
			level++;
			if (Alloy.Globals.drainRate + 5 < Alloy.Globals.maxDrainRate)
				Alloy.Globals.drainRate += 5;
			Ti.API.error('LEVEL UP');
			$.levelUpLabel.setText('Level '+level);
			$.levelUpLabel.show();
			setTimeout(function() {
				$.levelUpLabel.hide();
			}, 1500);
		}
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateScore() {
	$.scoreLabel.setText(score);
}

function PixelsToDPUnits(ThePixels)
{
    if ( Titanium.Platform.displayCaps.dpi > 160 )
        return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
    else 
        return ThePixels;
}
 
 
function DPUnitsToPixels(TheDPUnits)
{
    if ( Titanium.Platform.displayCaps.dpi > 160 )
          return (TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160));
    else 
        return TheDPUnits;
}

$.index.open();