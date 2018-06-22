Linq4JS.Helper.NonEnumerable("Take", function<T> (this: T[], count: number): T[] {
    return this.slice(0, count);
});