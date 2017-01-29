Array.prototype.Join = function <T>(char: string, selector?: any): string {
    let that: Array<T> = this;

    let array: Array<any> = that;

    if(selector != null){
        array = array.Select(selector);
    }

    return array.join(char);
};