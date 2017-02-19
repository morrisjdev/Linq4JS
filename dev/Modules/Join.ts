Array.prototype.Join = function <T>(this: Array<T>, char: string, selector?: ((item: T) => any) | string): string {
    let that: Array<T> = this;

    let array: Array<any> = that;

    if(selector != null){
        array = array.Select(selector);
    }

    return array.join(char);
};