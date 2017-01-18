Array.prototype.Add = function<T> (object: T, generateId?: boolean): Array<T> {
    let that: Array<T> = this;

    if (object != null) {

        if (generateId == true) {
            let newIndex: number;

            let last: T = that.LastOrDefault();
            if(last != null){

                newIndex = last["_Id"] != null ? last["_Id"] : 1;

                while(that.Any(function(x){
                    return x["_Id"] == newIndex;
                })){
                    newIndex++;
                }

                object["_Id"] = newIndex;
            }
            else{
                object["_Id"] = 1;
            }
        }

        that.push(object);
    }

    return that;
};