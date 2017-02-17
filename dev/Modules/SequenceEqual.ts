Array.prototype.SequenceEqual = function<T> (array: Array<T>): boolean {
    let that: Array<T> = this;

    if(that.Count() != array.Count()){
        return false;
    }

    for(let i = 0; i < that.length; i++){
        let keys = Object.keys(that[i]);

        for(let key of keys){
            if(that[i][key] != array[i][key]){
                return false;
            }
        }
    }

    return true;
};