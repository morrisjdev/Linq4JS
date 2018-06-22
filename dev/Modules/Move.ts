Linq4JS.Helper.NonEnumerable("Move", function<T> (this: T[], oldIndex: number, newIndex: number): T[] {
    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
    return this;
});