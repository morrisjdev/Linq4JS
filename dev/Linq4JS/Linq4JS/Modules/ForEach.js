Array.prototype.ForEach = function (action) {
    var that = this;
    var actionFunction = Linq4JS.Helper.ConvertFunction(action);
    for (var _i = 0, that_1 = that; _i < that_1.length; _i++) {
        var obj = that_1[_i];
        actionFunction(obj);
    }
    return that;
};
//# sourceMappingURL=ForEach.js.map