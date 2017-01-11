Array.prototype.Clone = function () {
    var that = this;
    var newArray = new Array();
    for (var _i = 0, that_1 = that; _i < that_1.length; _i++) {
        var obj = that_1[_i];
        newArray.Add(obj);
    }
    return newArray;
};
//# sourceMappingURL=Clone.js.map