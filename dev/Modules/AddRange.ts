Array.prototype.AddRange = function<T> (objects: Array<T>): Array<T> {
    let that: Array<T> = this;

    objects.ForEach(function (x: T) {
        that.Add(x);
    });

    return that;
};