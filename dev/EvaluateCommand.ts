namespace Linq4JS {
    export class EvaluateCommand {
        public Command: string;
        public SplitRegex: RegExp[] = [];
        public Finder: RegExp[] = [];

        constructor(command: string, ...identifier: string[]) {
            this.Command = command;

            for (let id of identifier) {
                let sSplitRegex: string;
                let sFinder: string;

                if (id.indexOf("{x}") !== -1) {
                    if (id.indexOf("{x}") === id.length - 3) {
                        sSplitRegex = "\\b" + id.replace(" {x}", "") + "\\b";
                        sFinder = "\\b" + id.replace(" {x}", "\\b (.*)");
                    } else {
                        sSplitRegex = "\\b" + id.replace(" {x}", "\\b .*? \\b") + "\\b";
                        sFinder = "\\b" + id.replace(" {x} ", "\\b (.*) \\b") + "\\b";
                    }
                } else {
                    sSplitRegex = "\\b" + id + "\\b";
                    sFinder = "\\b" + id + "\\b";
                }

                this.Finder.push(new RegExp(sFinder, "i"));
                this.SplitRegex.push(new RegExp(sSplitRegex, "gi"));
            }
        }
    }

    export class EvaluateCommandResult {
        public Command: string;
        public DynamicFunction: string;

        constructor(cmd: string, fn: string) {
            this.Command = cmd;
            this.DynamicFunction = fn;
        }
    }
}