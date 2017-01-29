Array.prototype.Aggregate = function<T> (method: any): string {
    let that: Array<T> = this;

    let result: string = "";
    let methodFunction: Function = Linq4JS.Helper.ConvertFunction(method);

    that.ForEach(function(x){
        result = methodFunction(result, x);
    });

    return result;
};