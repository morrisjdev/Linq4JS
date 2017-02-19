Array.prototype.Take = function<T> (this: T[], count: number): T[] {
    let that: T[] = this;

    return that.slice(0, count);
};