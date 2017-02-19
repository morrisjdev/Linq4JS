Array.prototype.Zip = function<T, X> (this: T[], array: Array<X>, result: ((first: T, second: X) => any) | string): Array<any> {
    let that: T[] = this;

    let resultFunction = Linq4JS.Helper.ConvertFunction<(first: T, second: X) => any>(result);

    let newArray = new Array<any>();

    for(let i = 0; i < that.length; i++){
        if(array[i] != null){
            newArray.Add(resultFunction(that[i], array[i]));
        }
    }

    return newArray;
};