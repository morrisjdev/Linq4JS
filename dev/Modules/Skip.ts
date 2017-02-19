Array.prototype.Skip = function<T> (this: T[], count: number): T[] {
    let that: T[] = this;

    return that.slice(count, that.Count());
};