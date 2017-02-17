Array.prototype.Max = function <T>(valueSelector?: ((item: T) => any) | string): T {
    let that: Array<T> = this;

    if(valueSelector != null){
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        return that.OrderBy(valueSelector).LastOrDefault();
    }else{
        return that.OrderBy(x => x).LastOrDefault();
    }
};