var Queue = require('Queue');

var queue = new Queue();

// Possible positions for branch creation / player positioning
var Position = {
	left : 0,
	right : 1,
	middle : 2,
};

// Adapt game to screen size
var rotate180 = Ti.UI.create2DMatrix().rotate(180);
var rowHeight = Math.floor(Titanium.Platform.displayCaps.platformHeight / 
	Alloy.Globals.numberOfTreeSections);
var columnWidth = Titanium.Platform.displayCaps.platformWidth / 3;
var playerPosOffset = columnWidth / 4;

// Initialize grid size in proportion to grid size
$.grid.setHeight(rowHeight * (Alloy.Globals.numberOfTreeSections - 1));
$.grid.setTransform(rotate180);

// Initialize character size in proportion to screen size
$.player.setHeight(rowHeight * 1.5);
$.player.setWidth(columnWidth / 2);
$.player.setBottom(rowHeight * 0.5);
// Player starting pos
$.player.setLeft(playerPosOffset);

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
	var row = Ti.UI.createView({
		height: rowHeight,
		layout: 'horizontal',
	});
	// Populate row
	for (var i = 0; i < 3; i++) {
		var box = Ti.UI.createView({
			height: rowHeight,
			width: columnWidth,
		});
		// Right box
		if (i == 0) {
			if (type == Position.right) {
				// Add branch
				box.backgroundColor = 'black';
			}
			else {
				// Add blank
				box.backgroundColor = 'white';
			}
		}
		// Middle box
		else if (i == 1) {
			// Add trunk
			box.backgroundColor = 'black';
		}
		// Left box
		else if (i == 2) {
			if (type == Position.left) {
				// Add branch
				box.backgroundColor = 'black';
			}
			else {
				// Add blank
				box.backgroundColor = 'white';
			}
		}
		row.add(box);
	}
	// Add row type to queue
	queue.enqueue(type);
	// Add next row to grid
	$.grid.add(row);
	if (type == Position.left || type == Position.right) {
		// Add a mandatory blank to guarantee death prevention if a branch
		// was created
		addRow(Position.middle);
	}
}

// Add a right branch to prevent a tree branch from killing the player
// at the start of the game
addRow(Position.right);
while (queue.getLength() < (Alloy.Globals.numberOfTreeSections - 1)) {
	addRow(getRandomInt(0,1));
}

$.leftChopButton.addEventListener('singletap', function() {
	$.player.setRight(undefined);
	$.player.setLeft(playerPosOffset);
	chopTree(Position.left);
});

$.rightChopButton.addEventListener('singletap', function() {
	$.player.setLeft(undefined);
	$.player.setRight(playerPosOffset);
	chopTree(Position.right);
});

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
	// 0 - left
	// 1 - right
	// 2 - blank
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
		alert('GAME OVER');
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$.index.open();