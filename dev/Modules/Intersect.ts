Linq4JS.Helper.NonEnumerable("Intersect", function<T> (this: T[], array: T[]): T[] {
    let that: T[] = this;

    let newArray: T[] = [];

    this.ForEach(x => {
        if (array.Contains(x)) {
            newArray.Add(x);
        }
    });

    array.ForEach(x => {
        if (that.Contains(x)) {
            newArray.Add(x);
        }
    });

    return newArray.Distinct();
});