Array.prototype.Contains = function<T> (this: T[], object: T): boolean {
    let that: T[] = this;

    return that.Any(function(x){
        return x === object;
    });
};