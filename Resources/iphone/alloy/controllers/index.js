function Controller() {
    function addRow(type) {
        var row = Ti.UI.createView({
            height: rowHeight,
            layout: "horizontal"
        });
        for (var i = 0; 3 > i; i++) {
            var box = Ti.UI.createView({
                height: rowHeight,
                width: columnWidth
            });
            0 == i ? box.backgroundColor = type == Position.right ? "black" : "white" : 1 == i ? box.backgroundColor = "black" : 2 == i && (box.backgroundColor = type == Position.left ? "black" : "white");
            row.add(box);
        }
        queue.enqueue(type);
        $.grid.add(row);
        (0 == type || 1 == type) && addRow(Position.middle);
    }
    function chopTree(playerPos) {
        var poppedRow = queue.dequeue();
        var nextRow = queue.peek();
        Ti.API.error("pop: " + poppedRow);
        queue.getLength() < Alloy.Globals.numberOfTreeSections - 1 && addRow(getRandomInt(0, 2));
        var rows = $.grid.getChildren();
        $.grid.remove(rows[0]);
        Ti.API.error("queue length: " + queue.getLength());
        nextRow == playerPos && alert("GAME OVER");
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.grid = Ti.UI.createView({
        width: Ti.UI.FILL,
        layout: "vertical",
        top: "0dp",
        id: "grid"
    });
    $.__views.index.add($.__views.grid);
    $.__views.trunk = Ti.UI.createView({
        id: "trunk"
    });
    $.__views.index.add($.__views.trunk);
    $.__views.leftChopButton = Ti.UI.createButton({
        height: "100%",
        width: "50%",
        left: "0dp",
        zIndex: 1,
        id: "leftChopButton"
    });
    $.__views.index.add($.__views.leftChopButton);
    $.__views.rightChopButton = Ti.UI.createButton({
        height: "100%",
        width: "50%",
        right: "0dp",
        zIndex: 1,
        id: "rightChopButton"
    });
    $.__views.index.add($.__views.rightChopButton);
    $.__views.player = Ti.UI.createView({
        pos: 0,
        backgroundColor: "green",
        id: "player"
    });
    $.__views.index.add($.__views.player);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Queue = require("Queue");
    var queue = new Queue();
    var Position = {
        left: 0,
        right: 1,
        middle: 2
    };
    var rotate180 = Ti.UI.create2DMatrix().rotate(180);
    var rowHeight = Math.floor(Titanium.Platform.displayCaps.platformHeight / Alloy.Globals.numberOfTreeSections);
    var columnWidth = Titanium.Platform.displayCaps.platformWidth / 3;
    var playerPosOffset = columnWidth / 4;
    $.grid.setHeight(rowHeight * (Alloy.Globals.numberOfTreeSections - 1));
    $.grid.setTransform(rotate180);
    $.player.setHeight(1.5 * rowHeight);
    $.player.setWidth(columnWidth / 2);
    $.player.setBottom(.5 * rowHeight);
    $.player.setLeft(playerPosOffset);
    addRow(Position.right);
    while (queue.getLength() < Alloy.Globals.numberOfTreeSections - 1) addRow(getRandomInt(0, 1));
    $.index.open();
    $.leftChopButton.addEventListener("singletap", function() {
        $.player.setRight(void 0);
        $.player.setLeft(playerPosOffset);
        chopTree(Position.left);
    });
    $.rightChopButton.addEventListener("singletap", function() {
        $.player.setLeft(void 0);
        $.player.setRight(playerPosOffset);
        chopTree(Position.right);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;