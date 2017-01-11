Array.prototype.UpdateRange = function (objects, primaryKeySelector) {
    var that = this;
    if (primaryKeySelector != null) {
        var selector_1 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        objects.ForEach(function (x) {
            that.Update(x, selector_1);
        });
    }
    else {
        objects.ForEach(function (x) {
            that.Update(x);
        });
    }
    return that;
};
//# sourceMappingURL=UpdateRange.js.map