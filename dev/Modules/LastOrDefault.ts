Array.prototype.LastOrDefault = function<T> (filter?: ((item: T) => boolean) | string): T {
    let that: Array<T> = this;

    if (filter != null) {
        let result: Array<T> = that.Where(filter);

        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            return null;
        }
    }
    else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        }
        else {
            return null;
        }
    }
};