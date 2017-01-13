﻿Array.prototype.Count = function <T>(filter?: any): number {
    let that: Array<T> = this;

    if (filter != null) {
        return that.Where(filter).length;
    }
    else {
        return that.length;
    }
};