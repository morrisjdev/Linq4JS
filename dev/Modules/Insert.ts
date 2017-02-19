Array.prototype.Insert = function<T> (this: Array<T>, object: T, index: number): Array<T> {
    let that: Array<T> = this;

    that.splice(index, 0, object);

    return that;
};