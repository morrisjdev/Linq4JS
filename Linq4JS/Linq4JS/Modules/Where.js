Array.prototype.Where = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        var newArray = new Array();
        for (var i = 0; i < that.length; i++) {
            var obj = that[i];
            if (filterFunction(obj) == true) {
                newArray.push(obj);
            }
        }
        return newArray;
    }
    else {
        throw "Linq4JS: You must define a filter";
    }
};
//# sourceMappingURL=Where.js.map