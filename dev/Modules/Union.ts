Linq4JS.Helper.NonEnumerable("Union", function<T> (this: T[], array: T[]): T[] {
    return this.Concat(array).Distinct();
});