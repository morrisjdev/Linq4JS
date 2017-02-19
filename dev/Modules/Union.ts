Array.prototype.Union = function<T> (this: T[], array: T[]): T[] {
    let that: T[] = this;
    return that.Concat(array).Distinct();
};