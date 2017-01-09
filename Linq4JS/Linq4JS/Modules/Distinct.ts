Array.prototype.Distinct = function<T> (valueSelector: any, takelast?: boolean): Array<T> {
    let that: Array<T> = this;

    let valueSelectorFunction: Function = Linq4JS.Helper.ConvertFunction(valueSelector);

    let temp: Array<T> = that.OrderBy<T>(valueSelectorFunction);
    let newArray: Array<T> = new Array<T>();
    let prev: T;

    for (let i = 0; i < temp.length; i++) {
        let current: T = temp[i];

        if (takelast == true) {
            let next: T = temp[i + 1];

            if (next != null) {
                if (valueSelector(current) != valueSelector(next)) {
                    newArray.Add(current);
                }
            }
            else {
                newArray.Add(current);
            }
        }
        else {
            if (prev != null && valueSelector(current) == valueSelector(prev)) {
                continue;
            }
            else {
                newArray.Add(current);
                prev = current;
            }
        }
    }

    return newArray;
};