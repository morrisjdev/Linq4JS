Array.prototype.Join = function <T>(this: T[], char: string, selector?: ((item: T) => any) | string): string {
    let that: T[] = this;

    let array: any[] = [];

    if (selector != null) {
        array = that.Select(selector);
    }

    return array.join(char);
};