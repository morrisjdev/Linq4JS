Linq4JS.Helper.NonEnumerable("RemoveRange", function<T> (this: T[], objects: T[], primaryKeySelector?: ((item: T) => any) | string): T[] {
    let that: T[] = this;

    if (primaryKeySelector != null) {
        let selector = Linq4JS.Helper.ConvertFunction<(item: T) => any>(primaryKeySelector);

        objects.ForEach(function (x: T) {
            that.Remove(x, selector);
        });
    } else {
        objects.ForEach(function (x: T) {
            that.Remove(x);
        });
    }

    return that;
});