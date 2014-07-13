/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  };

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  };

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  };

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  };

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  };

}

var queue = new Queue();

var rowType = {
	left : 0,
	right : 1,
	b : 2,
	mandatoryBlank : 3
};

var rotate180 = Ti.UI.create2DMatrix().rotate(180);
var rowHeight = Titanium.Platform.displayCaps.platformHeight / 7;
var columnWidth = Titanium.Platform.displayCaps.platformWidth / 3;
Ti.API.info(rowHeight + " " + columnWidth);

$.grid.setHeight(rowHeight * 6);
$.grid.setTransform(rotate180);

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
			if (type == rowType.right) {
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
			if (type == rowType.left) {
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
	queue.enqueue(type);
	$.grid.add(row);
	if (type == 0 || type == 1) {
		addRow(2);
	}
}

addRow(rowType.right);
addRow(rowType.left);
addRow(rowType.left);

$.index.open();

var num = 3;

$.chopButton.addEventListener('singletap', function() {
	// 0 - left
	// 1 - right
	// 2 - blank
	var nextRow = queue.dequeue();
	Ti.API.error('pop: '+nextRow);
	Ti.API.error('current length: '+queue.getLength());
	num++;
	if (num == 4) {
		num = 0;
		addRow(getRandomInt(0, 2));
	}
	var rows = $.grid.getChildren();
	$.grid.remove(rows[0]);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
