Array.prototype.All = function<T> (filter: any): boolean {
    let that: Array<T> = this;

    return that.Count(filter) == that.Count();
};