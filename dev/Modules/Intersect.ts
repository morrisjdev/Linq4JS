Array.prototype.Intersect = function<T> (array: Array<T>): Array<T> {
    let that: Array<T> = this;

    let newArray = new Array<T>();

    that.ForEach(x => {
        if(array.Contains(x)){
            newArray.Add(x);
        }
    });

    array.ForEach(x => {
        if(that.Contains(x)){
            newArray.Add(x);
        }
    });

    return newArray.Distinct();
};