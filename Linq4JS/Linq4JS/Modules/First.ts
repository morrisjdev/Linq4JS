Array.prototype.First = function<T> (filter?: any): T {
    let that: Array<T> = this;

    if (filter != null) {
        let result: Array<T> = that.Where<T>(filter);

        if (result.Any<T>()) {
            return result.Get<T>(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
    else {
        if (that.Any<T>()) {
            return that.Get<T>(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
};