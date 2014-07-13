function Controller() {
    function Queue() {
        var queue = [];
        var offset = 0;
        this.getLength = function() {
            return queue.length - offset;
        };
        this.isEmpty = function() {
            return 0 == queue.length;
        };
        this.enqueue = function(item) {
            queue.push(item);
        };
        this.dequeue = function() {
            if (0 == queue.length) return void 0;
            var item = queue[offset];
            if (2 * ++offset >= queue.length) {
                queue = queue.slice(offset);
                offset = 0;
            }
            return item;
        };
        this.peek = function() {
            return queue.length > 0 ? queue[offset] : void 0;
        };
    }
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
            0 == i ? box.backgroundColor = type == rowType.right ? "black" : "white" : 1 == i ? box.backgroundColor = "black" : 2 == i && (box.backgroundColor = type == rowType.left ? "black" : "white");
            row.add(box);
        }
        queue.enqueue(type);
        $.grid.add(row);
        (0 == type || 1 == type) && addRow(2);
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
    $.__views.chopButton = Ti.UI.createButton({
        bottom: "0dp",
        height: "45dp",
        width: Ti.UI.FILL,
        backgroundColor: "#1996be",
        id: "chopButton"
    });
    $.__views.index.add($.__views.chopButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var queue = new Queue();
    var rowType = {
        left: 0,
        right: 1,
        b: 2,
        mandatoryBlank: 3
    };
    var rotate180 = Ti.UI.create2DMatrix().rotate(180);
    var rowHeight = Titanium.Platform.displayCaps.platformHeight / 7;
    var columnWidth = Titanium.Platform.displayCaps.platformWidth / 3;
    Ti.API.info(rowHeight + " " + columnWidth);
    $.grid.setHeight(6 * rowHeight);
    $.grid.setTransform(rotate180);
    addRow(rowType.right);
    addRow(rowType.left);
    addRow(rowType.left);
    $.index.open();
    var num = 3;
    $.chopButton.addEventListener("singletap", function() {
        var nextRow = queue.dequeue();
        Ti.API.error("pop: " + nextRow);
        Ti.API.error("current length: " + queue.getLength());
        num++;
        if (4 == num) {
            num = 0;
            addRow(getRandomInt(0, 2));
        }
        var rows = $.grid.getChildren();
        $.grid.remove(rows[0]);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;