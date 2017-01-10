Array.prototype.Range = function<T> (start: number, length: number): Array<T> {
    let that: Array<T> = this;

    let newArray: Array<T> = new Array<T>();

    for (let i = start; i < start + length; i++) {
        newArray.Add(that.Get(i));
    }

    return newArray;
};