Linq4JS.Helper.NonEnumerable("Repeat", function <T>(this: T[], object: T, count: number): T[] {
    for (let i = 0; i < count; i++) {
        this.Add(object);
    }

    return this;
});