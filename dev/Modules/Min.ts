Linq4JS.Helper.NonEnumerable("Min", function <T>(this: T[], valueSelector?: ((item: T) => any) | string): (T | null) {
    if (valueSelector != null) {
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        return this.OrderBy(valueSelectorFunction).FirstOrDefault();
    } else {
        return this.OrderBy(x => x).FirstOrDefault();
    }
});