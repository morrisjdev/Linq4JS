Array.prototype.Take = function<T> (this: Array<T>, count: number): Array<T> {
    let that: Array<T> = this;

    return that.slice(0, count);
};