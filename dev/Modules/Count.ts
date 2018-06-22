Linq4JS.Helper.NonEnumerable("Count", function <T>(this: T[], filter?: ((item: T) => boolean) | string): number {
    if (filter != null) {
        return this.Where(filter).length;
    } else {
        return this.length;
    }
});