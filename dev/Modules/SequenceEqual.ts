Linq4JS.Helper.NonEnumerable("SequenceEqual", function<T> (this: T[], array: T[]): boolean {
    if (this === array) {
        return true;
    }

    if (this == null || array == null) {
        return false;
    }

    if (this.length !== array.length) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        const currentObjectThis: any = this[i];
        const currentObjectArray: any = array[i];

        if (currentObjectThis instanceof Array && currentObjectArray instanceof Array) {
            if (!currentObjectThis.SequenceEqual(currentObjectArray)) {
                return false;
            }
        } else if (currentObjectThis instanceof Object && currentObjectArray instanceof Object) {
            let keys = Object.keys(currentObjectThis);

            for (let key of keys){
                if (currentObjectThis[key] !== currentObjectArray[key]) {
                    return false;
                }
            }
        } else {
            if (currentObjectThis !== currentObjectArray) {
                return false;
            }
        }
    }

    return true;
});
