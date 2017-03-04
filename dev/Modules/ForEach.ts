Array.prototype.ForEach = function<T> (this: T[], action: ((item: T, index?: number) => boolean | any) | string): T[] {
    let that: T[] = this;

    let actionFunction = Linq4JS.Helper.ConvertFunction<(item: T, index?: number) => boolean | any>(action, true);

    for (let i = 0; i < that.length; i++) {
        let result = actionFunction(that[i], i);

        if (result != null && result === true) {
            break;
        }
    }

    return that;
};