Array.prototype.ToDictionary = function<T> (this: T[], keySelector: ((item: T) => any) | string, valueSelector?: ((item: T) => any) | string): any {
    let that: T[] = this;

    let keySelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(keySelector);

    let returnObject: any = {};

    if (valueSelector != null) {
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        that.ForEach(x => {
            returnObject[keySelectorFunction(x)] = valueSelectorFunction(x);
        });
    } else {
        that.ForEach(x => {
            returnObject[keySelectorFunction(x)] = x;
        });
    }

    return returnObject;
};