Linq4JS.Helper.NonEnumerable("Clone", function<T> (this: T[]): T[] {
    let newArray: T[] = [];

    for (let obj of this) {
        newArray.Add(obj);
    }

    return newArray;
});