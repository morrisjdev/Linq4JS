Linq4JS.Helper.NonEnumerable("SingleOrDefault", function<T> (this: T[], filter?: ((item: T) => boolean) | string): (T | null) {
    if (filter != null) {
        let result: T[] = this.Where(filter);

        if (result.Count() === 1) {
            return result.Get(0);
        } else {
            if (result.Count() > 1) {
                throw new Error("Linq4JS: The array contains more than one element");
            } else {
                return null;
            }
        }
    } else {
        if (this.Count() === 1) {
            return this.Get(0);
        } else {
            if (this.Count() > 1) {
                throw new Error("Linq4JS: The array contains more than one element");
            } else {
                return null;
            }
        }
    }
});