Array.prototype.ThenBy = function<T> (valueSelector: ((item: T) => any) | string): Array<T> {
    let that: Array<T> = this;

    let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

    if (that.Order == null || that.Order.Count() == 0) {
        throw "Linq4JS: Please call OrderBy or OrderByDescending before ThenBy";
    }

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