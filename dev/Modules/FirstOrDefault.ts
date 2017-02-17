Array.prototype.FirstOrDefault = function<T> (filter?: ((item: T) => boolean) | string): T {
    let that: Array<T> = this;

    if (filter != null) {
        let result: Array<T> = that.Where(filter);

        if (result.Any()) {
            return result.Get(0);
        }
        else {
            return null;
        }
    }
    else {
        if (that.Any()) {
            return that.Get(0);
        }
        else {
            return null;
        }
    }
};