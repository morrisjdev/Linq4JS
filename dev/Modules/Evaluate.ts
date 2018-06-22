Linq4JS.Helper.NonEnumerable("Evaluate", function<T> (this: T[], command: string): any {
    let commandParts: string[] = Linq4JS.Helper.SplitCommand(command);

    let computeObject: any = this;

    for (let cmd of commandParts) {
        let cmdResult = Linq4JS.Helper.MatchCommand(cmd);

        computeObject = computeObject[cmdResult.Command](cmdResult.DynamicFunction);
    }

    return computeObject;
});