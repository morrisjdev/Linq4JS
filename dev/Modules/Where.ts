Array.prototype.Where = function<T> (filter: ((item: T) => boolean) | string): Array<T> {
    let that: Array<T> = this;

    if (filter != null) {
        let filterFunction = Linq4JS.Helper.ConvertFunction<(item: T) => boolean>(filter);

        let newArray: Array<T> = new Array<T>();

        for (let i = 0; i < that.length; i++) {
            let obj: T = that[i];

            if (filterFunction(obj) == true) {
                newArray.push(obj);
            }
        }

        return newArray;
    }
    else {
        throw "Linq4JS: You must define a filter";
    }

};