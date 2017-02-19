Array.prototype.All = function<T> (this: Array<T>, filter: ((item: T) => boolean) | string): boolean {
    let that: Array<T> = this;

    return that.Count(filter) == that.Count();
};