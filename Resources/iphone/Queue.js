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

module.exports = Queue;