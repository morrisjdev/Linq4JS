Linq4JS.Helper.NonEnumerable("Single", function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    let result = this;

    if (filter != null) {
        result = this.Where(filter);
    }

    if (result.Count() === 1) {
        return result.Get(0);
    } else {
        throw new Error("Linq4JS: The array does not contain exactly one element");
    }
});
