Array.prototype.Union = function<T> (this: Array<T>, array: Array<T>): Array<T> {
    let that: Array<T> = this;
    return that.Concat(array).Distinct();
};