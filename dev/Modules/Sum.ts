Linq4JS.Helper.NonEnumerable("Sum", function <T>(this: T[], selector?: ((item: T) => any) | string, filter?: ((item: T) => boolean) | string): number {
    let result: number = 0;
    let array: any[] = this;

    if (filter != null) {
        array = array.Where(filter);
    }

    if (selector != null) {
        array = array.Select(selector);
    }

    array.ForEach(function(x){
        result += x;
    });

    return result;
});