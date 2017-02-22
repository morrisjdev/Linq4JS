Array.prototype.LastOrDefault = function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    let that: T[] = this;

    if (filter != null) {
        let result: T[] = that.Where(filter);

        if (result.Any()) {
            return result.Get(result.length - 1);
        } else {
            return null;
        }
    } else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        } else {
            return null;
        }
    }
};