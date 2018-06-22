Linq4JS.Helper.NonEnumerable("Any", function<T> (this: T[], filter?: ((item: T) => boolean) | string): boolean {
    return this.Count(filter) > 0;
});