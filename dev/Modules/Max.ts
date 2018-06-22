Linq4JS.Helper.NonEnumerable("Max", function <T>(this: T[], valueSelector?: ((item: T) => any) | string): (T | null) {
    if (valueSelector != null) {
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);
        return this.OrderBy(valueSelectorFunction).LastOrDefault();
    } else {
        return this.OrderBy(x => x).LastOrDefault();
    }
});