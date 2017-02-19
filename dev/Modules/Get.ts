Array.prototype.Get = function <T>(this: Array<T>, index: number): T {
    let that: Array<T> = this;

    return that[index];
};