Array.prototype.ThenBy = function<T> (valueSelector: any): Array<T> {
    let that: Array<T> = this;

    let valueSelectorFunction: Function = Linq4JS.Helper.ConvertFunction(valueSelector);

    let ordered: Array<T> = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));

    return ordered.sort(function (a, b) {

        for (let entry of ordered.Order) {
            let result: number = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction == Linq4JS.OrderDirection.Descending);

            if (result != 0) {
                return result;
            }
        }

        return 0;
    });
};