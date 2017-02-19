﻿Array.prototype.Add = function<T> (object: T, generateId?: boolean): Array<T> {
    let that: Array<T> = this;

    if (object != null) {
        if (generateId == true) {
            let newIndex: number;

            let castedObject: Linq4JS.GeneratedEntity = object as any;
            let last: Linq4JS.GeneratedEntity = that.LastOrDefault() as any;
            if(last != null){
                newIndex = last._GeneratedId_ != null ? last._GeneratedId_ : 1;

                while(that.Any(function(x: any){
                    return (x as Linq4JS.GeneratedEntity)._GeneratedId_ == newIndex;
                })){
                    newIndex++;
                }

                castedObject._GeneratedId_ = newIndex;
            }
            else{
                castedObject._GeneratedId_ = 1;
            }
        }

        that.push(object);
    }

    return that;
};