Array.prototype.ForEach = function<T> (action: any): Array<T> {
    let that: Array<T> = this;

    let actionFunction: Function = Linq4JS.Helper.ConvertFunction(action);

    for (let obj of that) {
        actionFunction(obj);
    }

    return that;
};