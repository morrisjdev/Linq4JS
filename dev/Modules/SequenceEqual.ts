Linq4JS.Helper.NonEnumerable("SequenceEqual", function<T> (this: T[], array: T[]): boolean {
    if (this.Count() !== array.Count()) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        let keys = Object.keys(this[i]);

        for (let key of keys){
            if ((this[i] as any)[key] !== (array[i] as any)[key]) {
                return false;
            }
        }
    }

    return true;
});