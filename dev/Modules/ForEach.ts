Array.prototype.ForEach = function<T> (this: Array<T>, action: ((item: T, index?: number) => boolean | any) | string): Array<T> {
    let that: Array<T> = this;

    let actionFunction = Linq4JS.Helper.ConvertFunction<(item: T, index?: number) => boolean | any>(action);

    for (let i = 0; i < that.length; i++) {
        let result = actionFunction(that[i], i);

        if(result != null && result == true){
            break;
        }
    }

    return that;
};