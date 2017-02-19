Array.prototype.AddRange = function<T> (this: Array<T>, objects: Array<T>, generateId: boolean): Array<T> {
    let that: Array<T> = this;

    objects.ForEach(function (x: T) {
        that.Add(x, generateId);
    });

    return that;
};