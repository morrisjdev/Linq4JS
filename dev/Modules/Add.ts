Array.prototype.Add = function<T> (object: T): Array<T> {
    let that: Array<T> = this;

    if (object != null) {
        that.push(object);
    }

    return that;
};