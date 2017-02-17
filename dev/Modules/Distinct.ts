Array.prototype.Distinct = function<T> (valueSelector?: ((item: T) => any) | string): Array<T> {
    let that: Array<T> = this;

    if(valueSelector != null){
        let valueSelectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(valueSelector);

        return that.filter((value, index, self) => {
            return self.FindIndex(x => valueSelectorFunction(x) == valueSelectorFunction(value)) == index;
        });
    }
    else{
        return that.filter((value, index, self) => {
            return self.indexOf(value) == index;
        });
    }
};