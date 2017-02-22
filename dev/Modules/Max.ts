Array.prototype.Max = function <T>(this: T[], valueSelector?: ((item: T) => any) | string): (T | null) {
    let that: T[] = this;

    if (valueSelector != null) {
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);
        return that.OrderBy(valueSelectorFunction).LastOrDefault();
    } else {
        return that.OrderBy(x => x).LastOrDefault();
    }
};