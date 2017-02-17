Array.prototype.Count = function <T>(filter?: ((item: T) => boolean) | string): number {
    let that: Array<T> = this;

    if (filter != null) {
        return that.Where(filter).length;
    }
    else {
        return that.length;
    }
};