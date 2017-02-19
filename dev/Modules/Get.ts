Array.prototype.Get = function <T>(this: T[], index: number): T {
    let that: T[] = this;

    return that[index];
};