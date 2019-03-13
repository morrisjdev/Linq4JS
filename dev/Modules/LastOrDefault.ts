Linq4JS.Helper.NonEnumerable("LastOrDefault", function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    let result = this;

    if (filter != null) {
        result = this.Where(filter);
    }

    if (result.Any()) {
        return result.Get(result.length - 1);
    } else {
        return null;
    }
});
