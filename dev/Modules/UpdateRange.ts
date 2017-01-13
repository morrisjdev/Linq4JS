Array.prototype.UpdateRange = function<T> (objects: Array<T>, primaryKeySelector?: any): Array<T> {
    let that: Array<T> = this;

    if (primaryKeySelector != null) {
        let selector: Function = Linq4JS.Helper.ConvertFunction(primaryKeySelector);

        objects.ForEach(function (x: T) {
            that.Update(x, selector);
        });
    }
    else {
        objects.ForEach(function (x: T) {
            that.Update(x);
        });
    }

    return that;
};