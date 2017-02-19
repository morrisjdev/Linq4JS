Array.prototype.Concat = function<T> (this: Array<T>, array: Array<T>): Array<T> {
    let that: Array<T> = this;
    that = that.concat(array); 
    return that;
};