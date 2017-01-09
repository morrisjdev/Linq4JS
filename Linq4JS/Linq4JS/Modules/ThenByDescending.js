Array.prototype.ThenByDescending = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction == Linq4JS.OrderDirection.Descending);
            if (result != 0) {
                return result;
            }
        }
        return 0;
    });
};
//# sourceMappingURL=ThenByDescending.js.map