Array.prototype.First = function<T> (filter?: any): T {
    let that: Array<T> = this;

    if (filter != null) {
        let result: Array<T> = that.Where(filter);

        if (result.Any()) {
            return result.Get(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
    else {
        if (that.Any()) {
            return that.Get(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
};