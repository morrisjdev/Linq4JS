Array.prototype.Last = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            throw "Linq4JS: The Last Entry was not found";
        }
    }
    else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        }
        else {
            throw "Linq4JS: The Last Entry was not found";
        }
    }
};
//# sourceMappingURL=Last.js.map