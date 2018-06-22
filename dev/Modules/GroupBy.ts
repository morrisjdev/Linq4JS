Linq4JS.Helper.NonEnumerable("GroupBy", function<T> (this: T[], selector: ((item: T) => any) | string): T[][] {
    let selectorFunction: (item: T) => any = Linq4JS.Helper.ConvertFunction<(item: T) => any>(selector);

    let newArray: T[][] = [];

    let ordered: T[] = this.OrderBy(selectorFunction);

    let prev: T;
    let newSub: T[] = [];

    ordered.ForEach(x => {
        if (prev != null) {
            if (selectorFunction(prev) !== selectorFunction(x)) {
                newArray.Add(newSub);
                newSub = [];
                newSub._linq4js_.GroupValue = selectorFunction(x);
            }
        } else {
            newSub._linq4js_.GroupValue = selectorFunction(x);
        }

        newSub.Add(x);
        prev = x;
    });

    if (newSub.Count() > 0) {
        newArray.Add(newSub);
    }

    return newArray;
});