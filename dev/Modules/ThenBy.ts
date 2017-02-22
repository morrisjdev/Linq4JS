Array.prototype.ThenBy = function<T> (this: T[], valueSelector: ((item: T) => any) | string): T[] {
    let that: T[] = this;

    let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

    if (that.Order == null || that.Order.Count() === 0) {
        throw new Error("Linq4JS: Please call OrderBy or OrderByDescending before ThenBy");
    }

    let ordered: T[] = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));

    return ordered.sort(function (a, b) {

        for (let entry of ordered.Order) {
            let result: number = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction === Linq4JS.OrderDirection.Descending);

            if (result !== 0) {
                return result;
            }
        }

        return 0;
    });
};