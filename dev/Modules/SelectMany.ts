Linq4JS.Helper.NonEnumerable("SelectMany", function<T> (this: T[], selector: ((item: T) => any) | string): any[] {
    let newArray: any[] = new Array();
    let selectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(selector);

    this.ForEach((item) => {
        let items = selectorFunction(item) || [];
        newArray.AddRange(items);
    });

    return newArray;
});