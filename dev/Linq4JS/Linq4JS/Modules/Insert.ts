Array.prototype.Insert = function<T> (object: T, index: number): Array<T> {
    let that: Array<T> = this;

    that.splice(index, 0, object);

    return that;
};