Array.prototype.Clone = function<T> (this: T[]): T[] {
    let that: T[] = this;

    let newArray: T[] = [];

    for (let obj of that) {
        newArray.Add(obj);
    }

    return newArray;
};