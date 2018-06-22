Linq4JS.Helper.NonEnumerable("All", function<T> (this: T[], filter: ((item: T) => boolean) | string): boolean {
    return this.Count(filter) === this.Count();
});