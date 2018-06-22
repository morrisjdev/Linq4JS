Linq4JS.Helper.NonEnumerable("ToDictionary", function<T> (this: T[], keySelector: ((item: T) => any) | string, valueSelector?: ((item: T) => any) | string): any {
    let keySelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(keySelector);

    let returnObject: any = {};

    if (valueSelector != null) {
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        this.ForEach(x => {
            returnObject[keySelectorFunction(x)] = valueSelectorFunction(x);
        });
    } else {
        this.ForEach(x => {
            returnObject[keySelectorFunction(x)] = x;
        });
    }

    return returnObject;
});