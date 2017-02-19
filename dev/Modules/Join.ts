Array.prototype.Join = function <T>(this: T[], char: string, selector?: ((item: T) => any) | string): string {
    let that: T[] = this;

    let array: Array<any> = that;

    if(selector != null){
        array = array.Select(selector);
    }

    return array.join(char);
};