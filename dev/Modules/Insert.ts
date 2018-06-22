Linq4JS.Helper.NonEnumerable("Insert", function<T> (this: T[], object: T, index: number): T[] {
    this.splice(index, 0, object);
    return this;
});