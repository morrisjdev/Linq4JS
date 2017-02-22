Array.prototype.Concat = function<T> (this: T[], array: T[]): T[] {
    let that: T[] = this;
    that = that.concat(array);
    return that;
};