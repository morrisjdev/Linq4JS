Array.prototype.Move = function<T> (oldIndex: number, newIndex: number): Array<T> {
    let that: Array<T> = this;

    that.splice(newIndex, 0, that.splice(oldIndex, 1)[0]);
    return that;
};