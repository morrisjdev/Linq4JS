Linq4JS.Helper.NonEnumerable("Contains", function<T> (this: T[], object: T): boolean {
    return this.Any(function(x){
        return x === object;
    });
});