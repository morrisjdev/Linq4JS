Array.prototype.RemoveRange = function<T> (this: Array<T>, objects: Array<T>, primaryKeySelector?: ((item: T) => any) | string): Array<T> {
    let that: Array<T> = this;

    if (primaryKeySelector != null) {
        let selector = Linq4JS.Helper.ConvertFunction<(item: T) => any>(primaryKeySelector);

        objects.ForEach(function (x: T) {
            that.Remove(x, selector);
        });
    }
    else {
        objects.ForEach(function (x: T) {
            that.Remove(x);
        });
    }

    return that;
};