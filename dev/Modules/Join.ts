Linq4JS.Helper.NonEnumerable("Join", function <T>(this: T[], char: string, selector?: ((item: T) => any) | string): string {
    let array: any[] = this;

    if (selector != null) {
        array = this.Select(selector);
    }

    return array.join(char);
});
