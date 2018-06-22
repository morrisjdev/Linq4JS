Linq4JS.Helper.NonEnumerable("TakeWhile", function<T> (
    this: T[],
    condition: ((item: T, storage?: any) => boolean) | string,
    initial?: ((storage: any) => void) | string,
    after?: ((item: T, storage: any) => void) | string): T[] {

    let conditionFunction: (item: T, storage?: any) => boolean =
        Linq4JS.Helper.ConvertFunction<(item: T, storage?: any) => boolean>(condition);

    let storage: any = {};

    if (initial != null) {
        let initialFunction = Linq4JS.Helper.ConvertFunction<(storage: any) => void>(initial);
        initialFunction(storage);
    }

    let afterFunction: ((item: T, storage: any) => void) | null = null;

    if (after != null) {
        afterFunction = Linq4JS.Helper.ConvertFunction<(item: T, storage: any) => void>(after);
    }

    let result: T[] = [];

    for (let object of this){
        if (conditionFunction(object, storage) === true) {
            result.Add(object);

            if (afterFunction != null) {
                afterFunction(object, storage);
            }
        }
    }

    return result;
});