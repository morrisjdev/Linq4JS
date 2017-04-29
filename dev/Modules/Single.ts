Array.prototype.Single = function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    let that: T[] = this;

    if (filter != null) {
        let result: T[] = that.Where(filter);

        if (result.Count() === 1) {
            return result.Get(0);
        } else {
            throw new Error("Linq4JS: The array does not contain exactly one element");
        }
    } else {
        if (that.Count() === 1) {
            return that.Get(0);
        } else {
            throw new Error("Linq4JS: The array does not contain exactly one element");
        }
    }
};