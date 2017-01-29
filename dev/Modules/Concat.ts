Array.prototype.Concat = function<T> (array: Array<T>): Array<T> {
    let that: Array<T> = this;
    that = that.concat(array); 
    return that;
};