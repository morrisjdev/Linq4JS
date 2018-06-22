Linq4JS.Helper.NonEnumerable("Zip", function<T, X> (this: T[], array: X[], result: ((first: T, second: X) => any) | string): any[] {
    let resultFunction = Linq4JS.Helper.ConvertFunction<(first: T, second: X) => any>(result);

    let newArray = new Array<any>();

    for (let i = 0; i < this.length; i++) {
        if (array[i] != null) {
            newArray.Add(resultFunction(this[i], array[i]));
        }
    }

    return newArray;
});