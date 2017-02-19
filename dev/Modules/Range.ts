Array.prototype.Range = function<T> (this: T[], start: number, length: number): T[] {
    let that: T[] = this;

    let newArray: T[] = [];

    for (let i = start; i < start + length; i++) {
        newArray.Add(that.Get(i));
    }

    return newArray;
};