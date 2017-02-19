Array.prototype.Where = function<T> (this: Array<T>, filter: ((item: T, index?: number) => boolean) | string): Array<T> {
    let that: Array<T> = this;

    if (filter != null) {
        let filterFunction = Linq4JS.Helper.ConvertFunction<(item: T, index?: number) => boolean>(filter);

        let newArray: Array<T> = new Array<T>();

        for (let i = 0; i < that.length; i++) {
            let obj: T = that[i];

            if (filterFunction(obj, i) == true) {
                newArray.push(obj);
            }
        }

        return newArray;
    }
    else {
        throw "Linq4JS: You must define a filter";
    }

};