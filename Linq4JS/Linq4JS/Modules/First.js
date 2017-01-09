Array.prototype.First = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
    else {
        if (that.Any()) {
            return that.Get(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
};
//# sourceMappingURL=First.js.map