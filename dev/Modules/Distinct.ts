Array.prototype.Distinct = function<T> (valueSelector?: ((item: T) => any) | string): Array<T> {
    let that: Array<T> = this;

    if(valueSelector != null){
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        return that.Where((x, i) => {
            return that.FindIndex(y => valueSelectorFunction(y) == valueSelectorFunction(x)) == i;
        })
    }
    else{
        return that.Where((x, i) => {
            return that.FindIndex(y => y == x) == i;
        })
    }
};