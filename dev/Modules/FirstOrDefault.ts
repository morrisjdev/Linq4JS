Linq4JS.Helper.NonEnumerable("FirstOrDefault", function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    let result = this;

    if (filter != null) {
        result = this.Where(filter);
    }

    if (result.Any()) {
        return result.Get(0);
    } else {
        return null;
    }
});
