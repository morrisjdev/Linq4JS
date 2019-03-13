Linq4JS.Helper.NonEnumerable("Zip", function<T, X, Y> (this: T[], array: X[], result: ((first: T, second: X) => Y) | string): Y[] {
    let resultFunction = Linq4JS.Helper.ConvertFunction<(first: T, second: X) => Y>(result);

    let newArray: Y[] = [];

    for (let i = 0; i < this.length; i++) {
        if (array[i] != null) {
            newArray.Add(resultFunction(this[i], array[i]));
        }
    }

    return newArray;
});
