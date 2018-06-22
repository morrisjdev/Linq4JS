Linq4JS.Helper.NonEnumerable("OrderByDescending", function<T> (this: T[], valueSelector: ((item: T) => any) | string): T[] {
    let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

    let ordered: T[] = this.Clone();
    ordered._linq4js_.Order = new Array<Linq4JS.OrderEntry>(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));

    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, true);
    });
});