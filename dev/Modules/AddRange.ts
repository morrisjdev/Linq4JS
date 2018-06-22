Linq4JS.Helper.NonEnumerable("AddRange", function<T> (this: T[], objects: T[], generateId: boolean): T[] {
    let that: T[] = this;

    objects.ForEach(function (x: T) {
        that.Add(x, generateId);
    });

    return that;
});