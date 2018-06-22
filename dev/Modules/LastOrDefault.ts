Linq4JS.Helper.NonEnumerable("LastOrDefault", function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    if (filter != null) {
        let result: T[] = this.Where(filter);

        if (result.Any()) {
            return result.Get(result.length - 1);
        } else {
            return null;
        }
    } else {
        if (this.Any()) {
            return this.Get(this.length - 1);
        } else {
            return null;
        }
    }
});