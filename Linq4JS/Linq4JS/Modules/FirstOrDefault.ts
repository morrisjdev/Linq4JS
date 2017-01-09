Array.prototype.FirstOrDefault = function<T> (filter?: any): T {
    let that: Array<T> = this;

    if (filter != null) {
        let result: Array<T> = that.Where<T>(filter);

        if (result.Any<T>()) {
            return result.Get<T>(0);
        }
        else {
            return null;
        }
    }
    else {
        if (that.Any<T>()) {
            return that.Get<T>(0);
        }
        else {
            return null;
        }
    }
};