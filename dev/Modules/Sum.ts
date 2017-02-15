Array.prototype.Sum = function <T>(selector?: any, filter?: any): number {
    let that: Array<T> = this;

    let result: number = 0;
    let array: Array<any> = that;

    if (filter != null) {
        array = array.Where(filter);
    }

    if(selector != null){
        array = array.Select(selector);
    }

    array.ForEach(function(x){
        result += x;
    });

    return result;
};