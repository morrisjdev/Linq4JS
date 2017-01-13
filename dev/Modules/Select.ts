Array.prototype.Select = function<T> (selector: any): any[] {
    let that: Array<T> = this;

    let selectorFunction: Function = Linq4JS.Helper.ConvertFunction(selector);

    let newArray: any[] = new Array();

    for (let obj of that) {
        newArray.Add(selectorFunction(obj));
    }

    return newArray;
};