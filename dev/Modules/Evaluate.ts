Array.prototype.Evaluate = function<T> (this: T[], command: string): any {
    let that: T[] = this;

    let commandParts: string[] = Linq4JS.Helper.SplitCommand(command);

    let computeObject: any = that;

    for (let cmd of commandParts) {
        let cmdResult = Linq4JS.Helper.MatchCommand(cmd);

        computeObject = computeObject[cmdResult.Command](cmdResult.DynamicFunction);
    }

    return computeObject;
};