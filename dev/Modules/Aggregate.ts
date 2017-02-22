Array.prototype.Aggregate = function<T> (this: T[], method: ((result: any, item: T) => any) | string, startVal?: any): string {
    let that: T[] = this;

    let result: any;

    if (startVal != null) {
        result = startVal;
    } else {
        result = "";
    }

    let methodFunction = Linq4JS.Helper.ConvertFunction<(result: any, item: T) => any>(method);

    that.ForEach(function(x){
        result = methodFunction(result, x);
    });

    return result;
};