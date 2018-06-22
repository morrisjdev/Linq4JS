Linq4JS.Helper.NonEnumerable("ThenByDescending", function<T> (this: T[], valueSelector: ((item: T) => any) | string): T[] {
    let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

    if (this._linq4js_.Order == null || this._linq4js_.Order.Count() === 0) {
        throw new Error("Linq4JS: Please call OrderBy or OrderByDescending before ThenByDescending");
    }

    let ordered: T[] = this;
    ordered._linq4js_.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));

    return ordered.sort(function (a, b) {

        for (let entry of ordered._linq4js_.Order) {
            let result: number = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction === Linq4JS.OrderDirection.Descending);

            if (result !== 0) {
                return result;
            }
        }

        return 0;
    });
});