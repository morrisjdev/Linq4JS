Array.prototype.GroupBy = function<T> (this: T[], selector: ((item: T) => any) | string): Array<T[]> {
    let that: T[] = this;

    let selectorFunction = Linq4JS.Helper.ConvertFunction<(item: T) => any>(selector);

    let newArray: T[][] = [];

    let ordered = that.OrderBy(selectorFunction);

    let prev: T;
    let newSub = new Array();

    ordered.ForEach(x => {
        if(prev != null){
            if(selectorFunction(prev) != selectorFunction(x)){
                newArray.Add(newSub);
                newSub = new Array();
                newSub.GroupValue = selectorFunction(x);
            }
        }
        else{
            newSub.GroupValue = selectorFunction(x);
        }

        newSub.Add(x);
        prev = x;
    });

    if(newSub.Count() > 0){
        newArray.Add(newSub);
    }

    return newArray;
};