﻿Linq4JS.Helper.NonEnumerable("Select", function<T, Y> (this: T[], selector: ((item: T) => Y) | string): Y[] {
    let selectorWork: ((item: T) => Y) | string = selector;

    if (typeof selectorWork === "string") {
        let selectStatement = selectorWork.substr(selectorWork.indexOf("=>") + ("=>").length);

        if (selectStatement.match(/^\s*{.*}\s*$/) != null) {
            selectStatement = selectStatement.replace(/^\s*{(.*)}\s*$/, "$1");

            let parts = selectStatement.split(/,(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/g);
            let newContent = "";

            for (let i = 0; i < parts.length; i++) {
                let part = parts[i];

                if (part.indexOf(":") !== -1) {
                    newContent += part;
                } else if (part.indexOf("=") !== -1) {
                    newContent += part.replace("=", ":");
                } else {
                    let values = part.split(".");
                    let name = values[values.length - 1];
                    newContent += name + ":" + part;
                }

                if (i < parts.length - 1) {
                    newContent += ",";
                }
            }

            selectorWork = selectorWork.substr(0, selectorWork.indexOf("=>")) + "=> return {" + newContent + "}";
        }
    }

    let selectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(selectorWork, false, true);

    let newArray: Y[] = [];

    if (this._linq4js_ && this._linq4js_.GroupValue) {
        newArray._linq4js_ = { GroupValue: this._linq4js_.GroupValue, Order: [] };
    }

    for (let obj of this) {
        newArray.Add(selectorFunction(obj));
    }

    return newArray;
});
