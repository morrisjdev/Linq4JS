Array.prototype.GroupBy = function<T> (selector: any): Array<Array<T>> {
    let that: Array<T> = this;

    let selectorFunction: Function = Linq4JS.Helper.ConvertFunction(selector);

    let newArray: Array<Array<T>> = new Array();

    let ordered = that.OrderBy(selectorFunction);

    let prev;
    let newSub = new Array();

    ordered.ForEach(x => {
        if(prev != null){
            if(selectorFunction(prev) != selectorFunction(x)){
                newArray.Add(newSub);
                newSub = new Array();
            }
            else{
                newSub.Add(x);
            }
        }
        else{
            newSub.Add(x);
            prev = x;
        }
    });

    if(newSub.Count() > 0){
        newArray.Add(newSub);
    }

    return newArray;
};