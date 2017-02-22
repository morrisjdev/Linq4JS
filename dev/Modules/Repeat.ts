Array.prototype.Repeat = function <T>(this: T[], object: T, count: number): T[] {
    let that: T[] = this;

    for (let i = 0; i < count; i++) {
        that.Add(object);
    }

    return that;
};