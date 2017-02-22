Array.prototype.Sum = function <T>(this: T[], selector?: ((item: T) => any) | string, filter?: ((item: T) => boolean) | string): number {
    let that: T[] = this;

    let result: number = 0;
    let array: any[] = [];

    if (filter != null) {
        array = that.Where(filter);
    }

    if (selector != null) {
        array = that.Select(selector);
    }

    array.ForEach(function(x){
        result += x;
    });

    return result;
};