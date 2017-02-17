Array.prototype.ForEach = function<T> (action: ((item: T) => boolean | any) | string): Array<T> {
    let that: Array<T> = this;

    let actionFunction = Linq4JS.Helper.ConvertFunction<(item: T) => boolean | any>(action);

    for (let obj of that) {
        let result = actionFunction(obj);

        if(result != null && result == true){
            break;
        }
    }

    return that;
};