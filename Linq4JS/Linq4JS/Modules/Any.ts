Array.prototype.Any = function<T> (filter?: any): boolean {
    let that: Array<T> = this;

    return that.Count<T>(filter) > 0;
};