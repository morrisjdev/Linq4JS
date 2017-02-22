Array.prototype.Count = function <T>(this: T[], filter?: ((item: T) => boolean) | string): number {
    let that: T[] = this;

    if (filter != null) {
        return that.Where(filter).length;
    } else {
        return that.length;
    }
};