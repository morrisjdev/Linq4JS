Linq4JS.Helper.NonEnumerable("UpdateRange", function<T> (this: T[], objects: T[], primaryKeySelector?: ((item: T) => any) | string): T[] {
    let that: T[] = this;

    if (primaryKeySelector != null) {
        let selector = Linq4JS.Helper.ConvertFunction<(item: T) => any>(primaryKeySelector);

        objects.ForEach(function (x: T) {
            that.Update(x, selector);
        });
    } else {
        objects.ForEach(function (x: T) {
            that.Update(x);
        });
    }

    return this;
});