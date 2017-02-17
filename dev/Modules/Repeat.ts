Array.prototype.Repeat = function <T>(object: T, count: number): Array<T> {
    let that: Array<T> = this;

    for(let i = 0; i < count; i++){
        that.Add(object);
    }

    return that;
};