Array.prototype.Any = function<T> (this: T[], filter?: ((item: T) => boolean) | string): boolean {
    let that: T[] = this;

    return that.Count(filter) > 0;
};