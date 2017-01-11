Array.prototype.RemoveRange = function (objects, primaryKeySelector) {
    var that = this;
    if (primaryKeySelector != null) {
        var selector_1 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        objects.ForEach(function (x) {
            that.Remove(x, selector_1);
        });
    }
    else {
        objects.ForEach(function (x) {
            that.Remove(x);
        });
    }
    return that;
};
//# sourceMappingURL=RemoveRange.js.map