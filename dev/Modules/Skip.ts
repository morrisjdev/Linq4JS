Array.prototype.Skip = function<T> (this: Array<T>, count: number): Array<T> {
    let that: Array<T> = this;

    return that.slice(count, that.Count());
};