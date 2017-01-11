Array.prototype.Remove = function (object, primaryKeySelector) {
    var that = this;
    var targetIndex;
    if (object == null) {
        throw "Linq4JS: The object cannot be null";
    }
    if (primaryKeySelector != null) {
        var selector_1 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = that.FindIndex(function (x) {
            return selector_1(x) == selector_1(object);
        });
    }
    else if (object["Id"] != null) {
        targetIndex = that.FindIndex(function (x) {
            return x.Id == object["Id"];
        });
    }
    else {
        targetIndex = that.FindIndex(function (x) {
            return x == object;
        });
    }
    if (targetIndex != -1) {
        that.splice(targetIndex, 1);
    }
    else {
        throw "Linq4JS: Nothing found to Remove";
    }
    return that;
};
//# sourceMappingURL=Remove.js.map