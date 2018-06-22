namespace Linq4JS {
    export class Helper {
        private static ConvertStringFunction(functionString: string, noAutoReturn?: boolean, noBracketReplace?: boolean): any {
            if (functionString.length === 0) {
                throw new Error("Linq4JS: Cannot convert empty string to function");
            }

            let varnameString: string = functionString
                .substring(0, functionString.indexOf("=>"))
                .split(" ").join("")
                .split("(").join("")
                .split(")").join("");

            let varnames: string[] = varnameString.split(",");

            let func: string = functionString
                .substring(functionString.indexOf("=>") + ("=>").length);

            if (noBracketReplace == null || noBracketReplace === false) {
                func.replace("{", "").replace("}", "");
            }

            func.split(".match(//gi)").join("");

            if (noAutoReturn == null || noAutoReturn === false) {
                /*No return outside of quotations*/
                if (func.match(/return(?=([^\"']*[\"'][^\"']*[\"'])*[^\"']*$)/g) == null) {
                    func = "return " + func;
                }
            }

            return Function(...varnames, func);
        }

        public static ConvertFunction<T>(testFunction: string | T, noAutoReturn?: boolean, noBracketReplace?: boolean): T {
            let result: T;

            if (typeof testFunction === "function") {
                result = testFunction;
            } else if (typeof testFunction === "string") {
                result = Linq4JS.Helper.ConvertStringFunction(testFunction, noAutoReturn, noBracketReplace);
            } else {
                throw new Error(`Linq4JS: Cannot use '${testFunction}' as function`);
            }

            return result;
        }

        public static OrderCompareFunction<T>(valueSelector: (item: T) => any, a: T, b: T, invert: boolean): number {
            let value_a: any = valueSelector(a);
            let value_b: any = valueSelector(b);

            let type_a: string = typeof value_a;
            let type_b: string = typeof value_b;

            if (type_a === "string" && type_a === type_b) {
                let value_a_string: string = value_a;
                value_a_string = value_a_string.toLowerCase();
                let value_b_string: string = value_b;
                value_b_string = value_b_string.toLowerCase();

                if (value_a_string > value_b_string) {
                    return invert === true ? -1 : 1;
                } else if (value_a_string < value_b_string) {
                    return invert === true ? 1 : -1;
                } else {
                    return 0;
                }

            } else if (type_a === "number" && type_a === type_b) {
                let value_a_number: number = value_a;
                let value_b_number: number = value_b;

                return invert === true ? value_b_number - value_a_number : value_a_number - value_b_number;
            } else if (type_a === "boolean" && type_a === type_b) {
                let value_a_bool: boolean = value_a;
                let value_b_bool: boolean = value_b;

                if (value_a_bool === value_b_bool) {
                    return 0;
                } else {
                    if (invert === true) {
                        return value_a_bool ? 1 : -1;
                    } else {
                        return value_a_bool ? -1 : 1;
                    }
                }
            } else {
                if (type_a === "undefined" && type_a === type_b) {
                    return 0;
                } else if (type_a === "undefined") {
                    return invert ? 1 : -1;
                } else if (type_b === "undefined") {
                    return invert ? -1 : 1;
                }

                return 0;
            }
        }

        public static SplitCommand(command: string): string[] {
            let splitIndexes: number[] = [];

            for (let cmd of this.Commands) {
                for (let split of cmd.SplitRegex) {
                    while (true) {
                        let result = split.exec(command);
                        if (result != null) {
                            splitIndexes.push(result.index);
                        } else {
                            break;
                        }
                    }
                }
            }

            let parts: string[] = [];

            splitIndexes = splitIndexes.Distinct().OrderBy(x => x);

            for (let i = 0; i < splitIndexes.length; i++) {
                if (i === splitIndexes.length - 1) {
                    parts.push(command.substr(splitIndexes[i]));
                } else {
                    parts.push(command.substr(splitIndexes[i], splitIndexes[i + 1] - splitIndexes[i]));
                }
            }

            return parts;
        }

        public static MatchCommand(cmd: string): EvaluateCommandResult {

            for (let command of this.Commands) {

                for (let regex of command.Finder) {

                    let result: RegExpMatchArray | null = cmd.match(regex);

                    if (result != null) {
                        return new EvaluateCommandResult(command.Command, result[1]);
                    }
                }

            }

            throw new Error(`Linq4JS: No matching command was found for '${cmd}'`);
        }

        public static Commands: EvaluateCommand[] = [
            new EvaluateCommand("Clone", "clone"),
            new EvaluateCommand("Reverse", "reverse"),
            new EvaluateCommand("Contains", "contains {x}"),
            new EvaluateCommand("Join", "join {x}"),
            new EvaluateCommand("Sum", "sum {x}", "sum"),
            new EvaluateCommand("Average", "average {x}", "average"),
            new EvaluateCommand("Where", "where {x}"),
            new EvaluateCommand("SelectMany", "selectmany {x}", "select many {x}", "select {x} many"),
            new EvaluateCommand("Select", "select {x}"),
            new EvaluateCommand("Get", "get {x}"),
            new EvaluateCommand("ForEach", "foreach {x}", "for each {x}"),
            new EvaluateCommand("Count", "count", "count {x}"),
            new EvaluateCommand("All", "all {x}"),
            new EvaluateCommand("Any", "any {x}", "any"),
            new EvaluateCommand("TakeWhile", "take while {x}", "take {x} while", "takewhile {x}"),
            new EvaluateCommand("Take", "take {x}"),
            new EvaluateCommand("Skip", "skip {x}"),
            new EvaluateCommand("Min", "min {x}", "min"),
            new EvaluateCommand("Max", "max {x}", "max"),
            new EvaluateCommand("GroupBy", "groupby {x}", "group by {x}"),
            new EvaluateCommand("Distinct", "distinct {x}", "distinct"),
            new EvaluateCommand("FindLastIndex", "findlastindex {x}", "find last index {x}", "findindex {x} last", "find index {x} last"),
            new EvaluateCommand("FindIndex", "findfirstindex {x}", "find first index {x}", "findindex {x} first", "find index {x} first", "findindex {x}", "find index {x}"),
            new EvaluateCommand("OrderByDescending", "orderby {x} descending", "order by {x} descending", "orderby descending {x}", "orderbydescending {x}", "order by descending {x}"),
            new EvaluateCommand("OrderBy", "orderby {x} ascending", "order by {x} ascending", "orderbyascending {x}", "order by ascending {x}", "orderby {x}", "order by {x}"),
            new EvaluateCommand("FirstOrDefault", "firstordefault {x}", "first or default {x}", "firstordefault", "first or default"),
            new EvaluateCommand("LastOrDefault", "lastordefault {x}", "last or default {x}", "lastordefault", "last or default"),
            new EvaluateCommand("SingleOrDefault", "singleordefault {x}", "single or default {x}", "singleordefault", "single or default"),
            new EvaluateCommand("First", "first {x}", "first"),
            new EvaluateCommand("Last", "last {x}", "last"),
            new EvaluateCommand("Single", "single {x}", "single"),
            new EvaluateCommand("ThenByDescending", "thenby {x} descending", "then by {x} descending", "thenbydescending {x}", "then by descending {x}"),
            new EvaluateCommand("ThenBy", "thenby {x} ascending", "then by {x} ascending", "thenbyascending {x}", "then by ascending {x}", "thenby {x}", "then by {x}")
        ];

        public static NonEnumerable(name: string, value: Function) {
            Object.defineProperty(Array.prototype, name, {
                value: value,
                enumerable: false
            });
        }
    }
}

Object.defineProperty(Array.prototype, "_linq4js_", {
    value: { Order: [] },
    enumerable: false
});