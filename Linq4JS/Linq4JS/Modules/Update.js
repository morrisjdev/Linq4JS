Array.prototype.Update = function (object, primaryKeySelector) {
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
        var keys = Object.keys(object);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key != "Id") {
                that[targetIndex][key] = object[key];
            }
        }
    }
    else {
        throw "Linq4JS: Nothing found to Update";
    }
    return that;
};
//# sourceMappingURL=Update.js.map