Array.prototype.Union = function<T> (array: Array<T>): Array<T> {
    let that: Array<T> = this;
    return that.Concat(array).Distinct();
};