Linq4JS.Helper.NonEnumerable("Last", function<T> (this: T[], filter?: ((item: T) => boolean) | string): T {
    if (filter != null) {
        let result: T[] = this.Where(filter);

        if (result.Any()) {
            return result.Get(result.length - 1);
        } else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    } else {
        if (this.Any()) {
            return this.Get(this.length - 1);
        } else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    }
});