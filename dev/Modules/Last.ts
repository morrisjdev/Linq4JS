Array.prototype.Last = function<T> (this: T[], filter?: ((item: T) => boolean) | string): T {
    let that: T[] = this;

    if (filter != null) {
        let result: T[] = that.Where(filter);

        if (result.Any()) {
            return result.Get(result.length - 1);
        } else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    } else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        } else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    }
};