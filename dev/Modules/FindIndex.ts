﻿Linq4JS.Helper.NonEnumerable("FindIndex", function<T> (this: T[], filter: ((item: T) => boolean) | string): number {
    if (filter != null) {
        let filterFunction = Linq4JS.Helper.ConvertFunction<(item: T) => boolean>(filter);

        for (let i = 0; i < this.length; i++) {
            let obj: T = this[i];

            if (filterFunction(obj)) {
                return i;
            }
        }

        return -1;
    } else {
        throw new Error("Linq4JS: You must define a filter");
    }
});
