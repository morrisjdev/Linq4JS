Linq4JS.Helper.NonEnumerable("First", function<T> (this: T[], filter?: ((item: T) => boolean) | string): T {
    let result = this;

    if (filter != null) {
        result = this.Where(filter);
    }

    if (result.Any()) {
        return result.Get(0);
    } else {
        throw new Error("Linq4JS: The First Entry was not found");
    }
});
