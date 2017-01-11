Array.prototype.Distinct = function (valueSelector, takelast) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var temp = that.OrderBy(valueSelectorFunction);
    var newArray = new Array();
    var prev;
    for (var i = 0; i < temp.length; i++) {
        var current = temp[i];
        if (takelast == true) {
            var next = temp[i + 1];
            if (next != null) {
                if (valueSelectorFunction(current) != valueSelectorFunction(next)) {
                    newArray.Add(current);
                }
            }
            else {
                newArray.Add(current);
            }
        }
        else {
            if (prev != null && valueSelectorFunction(current) == valueSelectorFunction(prev)) {
                continue;
            }
            else {
                newArray.Add(current);
                prev = current;
            }
        }
    }
    return newArray;
};
//# sourceMappingURL=Distinct.js.map