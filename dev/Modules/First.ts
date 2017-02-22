Array.prototype.First = function<T> (this: T[], filter?: ((item: T) => boolean) | string): T {
    let that: T[] = this;

    if (filter != null) {
        let result: T[] = that.Where(filter);

        if (result.Any()) {
            return result.Get(0);
        } else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    } else {
        if (that.Any()) {
            return that.Get(0);
        } else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    }
};