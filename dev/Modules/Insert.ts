Array.prototype.Insert = function<T> (this: T[], object: T, index: number): T[] {
    let that: T[] = this;

    that.splice(index, 0, object);

    return that;
};