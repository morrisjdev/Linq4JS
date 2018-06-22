Linq4JS.Helper.NonEnumerable("Where", function<T> (this: T[], filter: ((item: T, index?: number) => boolean) | string): T[] {
    if (filter != null) {
        let filterFunction = Linq4JS.Helper.ConvertFunction<(item: T, index?: number) => boolean>(filter);

        let newArray: T[] = [];

        for (let i = 0; i < this.length; i++) {
            let obj: T = this[i];

            if (filterFunction(obj, i) === true) {
                newArray.push(obj);
            }
        }

        return newArray;
    } else {
        throw new Error("Linq4JS: You must define a filter");
    }

});