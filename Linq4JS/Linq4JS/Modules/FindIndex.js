Array.prototype.FindIndex = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        for (var i = 0; i < that.length; i++) {
            var obj = that[i];
            if (filter(obj) == true) {
                return i;
            }
        }
        return -1;
    }
    else {
        throw "Linq4JS: You must define a filter";
    }
};
//# sourceMappingURL=FindIndex.js.map