Array.prototype.Range = function (start, length) {
    var that = this;
    var newArray = new Array();
    for (var i = start; i < start + length; i++) {
        newArray.Add(that.Get(i));
    }
    return newArray;
};
//# sourceMappingURL=Range.js.map