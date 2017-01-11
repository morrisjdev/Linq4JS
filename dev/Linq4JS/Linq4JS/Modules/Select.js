Array.prototype.Select = function (selector) {
    var that = this;
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selector);
    var newArray = new Array();
    for (var _i = 0, that_1 = that; _i < that_1.length; _i++) {
        var obj = that_1[_i];
        newArray.Add(selectorFunction(obj));
    }
    return newArray;
};
//# sourceMappingURL=Select.js.map