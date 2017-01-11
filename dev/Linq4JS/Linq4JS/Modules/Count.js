Array.prototype.Count = function (filter) {
    var that = this;
    if (filter != null) {
        return that.Where(filter).length;
    }
    else {
        return that.length;
    }
};
//# sourceMappingURL=Count.js.map