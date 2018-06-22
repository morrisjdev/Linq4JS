Linq4JS.Helper.NonEnumerable("Skip", function<T> (this: T[], count: number): T[] {
    return this.slice(count, this.Count());
});