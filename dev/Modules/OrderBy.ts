Array.prototype.OrderBy = function<T> (this: T[], valueSelector: ((item: T) => any) | string): T[] {
    let that: T[] = this;

    let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

    let ordered: T[] = that.Clone();
    ordered.Order = new Array<Linq4JS.OrderEntry>(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));

    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, false);
    });
};