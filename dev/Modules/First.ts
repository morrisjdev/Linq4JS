Linq4JS.Helper.NonEnumerable("First", function<T> (this: T[], filter?: ((item: T) => boolean) | string): T {
    if (filter != null) {
        let result: T[] = this.Where(filter);

        if (result.Any()) {
            return result.Get(0);
        } else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    } else {
        if (this.Any()) {
            return this.Get(0);
        } else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    }
});