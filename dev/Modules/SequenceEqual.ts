Array.prototype.SequenceEqual = function<T> (this: T[], array: T[]): boolean {
    let that: T[] = this;

    if (that.Count() !== array.Count()) {
        return false;
    }

    for (let i = 0; i < that.length; i++) {
        let keys = Object.keys(that[i]);

        for (let key of keys){
            if ((that[i] as any)[key] !== (array[i] as any)[key]) {
                return false;
            }
        }
    }

    return true;
};