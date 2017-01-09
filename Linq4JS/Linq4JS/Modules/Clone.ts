Array.prototype.Clone = function <T>(): Array<T> {
    let that: Array<T> = this;

    let newArray: Array<T> = new Array<T>();

    for (let obj of that) {
        newArray.Add(obj);
    }

    return newArray;
};