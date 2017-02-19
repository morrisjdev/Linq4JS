Array.prototype.Move = function<T> (this: T[], oldIndex: number, newIndex: number): T[] {
    let that: T[] = this;

    that.splice(newIndex, 0, that.splice(oldIndex, 1)[0]);
    return that;
};