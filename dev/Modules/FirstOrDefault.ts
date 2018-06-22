Linq4JS.Helper.NonEnumerable("FirstOrDefault", function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    if (filter != null) {
        let result: T[] = this.Where(filter);

        if (result.Any()) {
            return result.Get(0);
        } else {
            return null;
        }
    } else {
        if (this.Any()) {
            return this.Get(0);
        } else {
            return null;
        }
    }
});