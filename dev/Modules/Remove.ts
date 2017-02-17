Array.prototype.Remove = function<T> (object: T, primaryKeySelector?: ((item: T) => any) | string): Array<T> {
    let that: Array<T> = this;

    let targetIndex: number;

    if (object == null) {
        throw "Linq4JS: The object cannot be null";
    }

    if (primaryKeySelector != null) {
        let selector = Linq4JS.Helper.ConvertFunction<(item: T) => any>(primaryKeySelector);

        targetIndex = that.FindIndex(function (x: T) {
            return selector(x) == selector(object);
        });
    }
    else if (object["Id"] != null) {
        targetIndex = that.FindIndex(function (x: T) {
            return x["Id"] == object["Id"];
        });
    }
    else {
        targetIndex = that.FindIndex(function (x: T) {
            return x == object;
        });
    }

    if (targetIndex != -1) {
        that.splice(targetIndex, 1);
    }
    else {
        throw "Linq4JS: Nothing found to Remove";
    }

    return that;
};