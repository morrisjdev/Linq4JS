﻿Array.prototype.Update = function<T> (object: T, primaryKeySelector?: any): Array<T> {
    let that: Array<T> = this;

    let targetIndex: number;

    if (object == null) {
        throw "Linq4JS: The object cannot be null";
    }

    if (primaryKeySelector != null) {
        let selector: Function = Linq4JS.Helper.ConvertFunction(primaryKeySelector);

        targetIndex = that.FindIndex(function (x) {
            return selector(x) == selector(object);
        });
    }
    else if (object["Id"] != null) {
        targetIndex = that.FindIndex(function (x) {
            return x.Id == object["Id"];
        });
    }
    else {
        targetIndex = that.FindIndex(function (x) {
            return x == object;
        });
    }

    if (targetIndex != -1) {
        let keys: string[] = Object.keys(object);

        for (let key of keys) {
            if (key != "Id") {
                that[targetIndex][key] = object[key];
            }
        }
    }
    else {
        throw "Linq4JS: Nothing found to Update";
    }

    return that;
};