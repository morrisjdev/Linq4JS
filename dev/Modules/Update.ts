Linq4JS.Helper.NonEnumerable("Update", function<T> (this: T[], object: T, primaryKeySelector?: ((item: T) => any) | string): T[] {
    let targetIndex: number;

    if (object == null) {
        throw new Error("Linq4JS: The object cannot be null");
    }

    let castedObject: Linq4JS.GeneratedEntity = object as any;

    if (primaryKeySelector != null) {
        let selector = Linq4JS.Helper.ConvertFunction<(item: T) => any>(primaryKeySelector);

        targetIndex = this.FindIndex(function (x: T) {
            return selector(x) === selector(object);
        });
    } else if (castedObject._GeneratedId_ != null) {
        targetIndex = this.FindIndex(function (x: any) {
            return (x as Linq4JS.GeneratedEntity)._GeneratedId_ === castedObject._GeneratedId_;
        });
    } else if (castedObject.Id != null) {
        targetIndex = this.FindIndex(function (x: any) {
            return (x as Linq4JS.GeneratedEntity).Id === castedObject.Id;
        });
    } else {
        targetIndex = this.FindIndex(function (x: T) {
            return x === object;
        });
    }

    if (targetIndex !== -1) {
        let keys: string[] = Object.keys(object);

        for (let key of keys) {
            if (key !== "Id") {
                (this[targetIndex] as any)[key] = (object as any)[key];
            }
        }
    } else {
        throw new Error("Linq4JS: Nothing found to Update");
    }

    return this;
});