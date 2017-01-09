Array.prototype.Last = function<T> (filter?: any): T {
    let that: Array<T> = this;

    if (filter != null) {
        let result: Array<T> = that.Where<T>(filter);

        if (result.Any<T>()) {
            return result.Get<T>(result.length - 1);
        }
        else {
            throw "Linq4JS: The Last Entry was not found";
        }
    }
    else {
        if (that.Any<T>()) {
            return that.Get<T>(that.length - 1);
        }
        else {
            throw "Linq4JS: The Last Entry was not found";
        }
    }
};