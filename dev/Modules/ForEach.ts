Linq4JS.Helper.NonEnumerable("ForEach", function<T> (this: T[], action: ((item: T, index?: number) => boolean | any) | string): T[] {
    let actionFunction = Linq4JS.Helper.ConvertFunction<(item: T, index?: number) => boolean | any>(action, true);

    for (let i = 0; i < this.length; i++) {
        let result = actionFunction(this[i], i);

        if (result != null && result === true) {
            break;
        }
    }

    return this;
});