Array.prototype.Skip = function<T> (count: number): Array<T> {
    let that: Array<T> = this;

    return that.slice(count, that.Count());
};