Linq4JS.Helper.NonEnumerable("SelectMany", function<T, Y> (this: T[], selector: ((item: T) => Y[]) | string): Y[] {
    let newArray: Y[] = [];
    let selectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => Y[]>(selector);

    this.ForEach((item) => {
        let items = selectorFunction(item) || [];
        newArray.AddRange(items);
    });

    return newArray;
});
