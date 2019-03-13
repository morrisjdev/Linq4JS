Linq4JS.Helper.NonEnumerable("ToDictionary",
    function<T, Y> (this: T[], keySelector: ((item: T) => (string|number)) | string, valueSelector?: ((item: T) => Y) | string):
        { [prop: string]: Y, [prop: number]: Y } {
    let keySelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => (string|number)>(keySelector);

    let returnObject: any = {};

    if (valueSelector != null) {
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => Y>(valueSelector);

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
