Array.prototype.Where = function<T> (this: T[], filter: ((item: T, index?: number) => boolean) | string): T[] {
    let that: T[] = this;

    if (filter != null) {
        let filterFunction = Linq4JS.Helper.ConvertFunction<(item: T, index?: number) => boolean>(filter);

        let newArray: T[] = [];

        for (let i = 0; i < that.length; i++) {
            let obj: T = that[i];

            if (filterFunction(obj, i) === true) {
                newArray.push(obj);
            }
        }

        return newArray;
    } else {
        throw new Error("Linq4JS: You must define a filter");
    }

};