Array.prototype.RemoveRange = function<T> (objects: Array<T>, primaryKeySelector?: any): Array<T> {
    let that: Array<T> = this;

    if (primaryKeySelector != null) {
        let selector: Function = Linq4JS.Helper.ConvertFunction(primaryKeySelector);

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