Array.prototype.Min = function <T>(valueSelector?: ((item: T) => any) | string): T {
    let that: Array<T> = this;

    if(valueSelector != null){
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        return that.OrderBy(valueSelector).FirstOrDefault();
    }else{
        return that.OrderBy(x => x).FirstOrDefault();
    }
};