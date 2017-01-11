var Linq4JS;
(function (Linq4JS) {
    var OrderEntry = (function () {
        function OrderEntry(_direction, _valueSelector) {
            this.Direction = _direction;
            this.ValueSelector = _valueSelector;
        }
        return OrderEntry;
    }());
    Linq4JS.OrderEntry = OrderEntry;
    (function (OrderDirection) {
        OrderDirection[OrderDirection["Ascending"] = 0] = "Ascending";
        OrderDirection[OrderDirection["Descending"] = 1] = "Descending";
    })(Linq4JS.OrderDirection || (Linq4JS.OrderDirection = {}));
    var OrderDirection = Linq4JS.OrderDirection;
})(Linq4JS || (Linq4JS = {}));
//# sourceMappingURL=OrderEntry.js.map