Array.prototype.Select = function<T> (selector: ((item: T) => any) | string): any[] {
    let that: Array<T> = this;

    let selectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(selector);

    let newArray: any[] = new Array();

    for (let obj of that) {
        newArray.Add(selectorFunction(obj));
    }

    return newArray;
};