// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Number of rows to make up the tree
Alloy.Globals.numberOfTreeSections = 7;

// Initialize health
Alloy.Globals.maxHealth = 10000;
Alloy.Globals.health = 5000;
Alloy.Globals.drainRate = 10;

Ti.App.addEventListener('gameStart', function() {
	Alloy.Globals.drain = setInterval(function() {
		Alloy.Globals.health -= Alloy.Globals.drainRate;
		Ti.API.error('health: '+Alloy.Globals.health);
		if (Alloy.Globals.health <= 0) {
			Ti.API.error('YOU ARE DEAD');
			alert('GAME OVER');
			clearInterval(Alloy.Globals.drain);
			Ti.App.fireEvent('gameOver');
		}
	}, 10); 
});

Ti.App.addEventListener('gameOver', function () {
	clearInterval(Alloy.Globals.drain);
	// To make sure interval is stopped before resetting the health
	setTimeout(function() {
		Alloy.Globals.health = 5000;
		Alloy.Globals.drainRate = 10;
	}, 100);
});

Ti.App.addEventListener('gamePause', function() {
	// Save current health, cancel interval
});
