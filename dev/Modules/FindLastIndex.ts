Linq4JS.Helper.NonEnumerable("FindLastIndex", function<T> (this: T[], filter: ((item: T) => boolean) | string): number {
    if (filter != null) {
        let filterFunction = Linq4JS.Helper.ConvertFunction<(item: T) => boolean>(filter);

        for (let i = this.length - 1; i >= 0; i--) {
            let obj: T = this[i];

            if (filterFunction(obj) === true) {
                return i;
            }
        }

        return -1;
    } else {
        throw new Error("Linq4JS: You must define a filter");
    }
});