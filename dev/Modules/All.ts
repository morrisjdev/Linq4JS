Array.prototype.All = function<T> (this: T[], filter: ((item: T) => boolean) | string): boolean {
    let that: T[] = this;

    return that.Count(filter) === that.Count();
};