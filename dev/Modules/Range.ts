Linq4JS.Helper.NonEnumerable("Range", function<T> (this: T[], start: number, length: number): T[] {
    let newArray: T[] = [];

    for (let i = start; i < start + length; i++) {
        newArray.Add(this.Get(i));
    }

    return newArray;
});