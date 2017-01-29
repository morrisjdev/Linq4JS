namespace Linq4JS {
    export class Helper {
        static ConvertStringFunction: Function = function (functionString: string): Function {

            if (functionString.length == 0) {
                throw "Linq4JS: Cannot convert empty string to function";
            }

            let varnameString: string = functionString.substring(0, functionString.indexOf("=>")).replace(" ", "").replace("(", "").replace(")", "");

            let varnames: Array<string> = varnameString.split(",");

            let func: string = functionString
                .substring(functionString.indexOf("=>") + 2)
                .replace("{", "").replace("}", "")
                .split(".match(//gi)").join("");

            /*No return outside of quotations*/
            if(func.match(/return(?=([^\"']*[\"'][^\"']*[\"'])*[^\"']*$)/g) == null){
                func = "return " + func;
            }

            return Function(...varnames, func);
        }

        static ConvertFunction: Function = function (testFunction: any): Function {

            let result: Function;

            if (typeof testFunction == "function") {
                result = testFunction;
            }
            else if (typeof testFunction == "string") {
                result = Linq4JS.Helper.ConvertStringFunction(testFunction);
            }
            else {
                throw `Linq4JS: Cannot use '${testFunction}' as function`;
            }

            return result;
        }

        static OrderCompareFunction: Function = function (valueSelector: Function, a: Linq4JS.Entity, b: Linq4JS.Entity, invert: boolean): number {
            let value_a: any = valueSelector(a);
            let value_b: any = valueSelector(b);

            let type = typeof value_a;

            if (type == "string") {
                let value_a_string: string = value_a;
                value_a_string = value_a_string.toLowerCase();
                let value_b_string: string = value_b;
                value_b_string = value_b_string.toLowerCase();

                if (value_a_string > value_b_string) {
                    return invert == true ? -1 : 1;
                }
                else if (value_a_string < value_b_string) {
                    return invert == true ? 1 : -1;
                }
                else {
                    return 0;
                }

            }
            else if (type == "number") {
                let value_a_number: number = value_a;
                let value_b_number: number = value_b;

                return invert == true ? value_b_number - value_a_number : value_a_number - value_b_number;
            }
            else if (type == "boolean") {
                let value_a_bool: boolean = value_a;
                let value_b_bool: boolean = value_b;

                if (value_a_bool == value_b_bool) {
                    return 0;
                }
                else {
                    if (invert == true) {
                        return value_a_bool ? 1 : -1;
                    }
                    else {
                        return value_a_bool ? -1 : 1;
                    }
                }
            }
            else {
                throw `Linq4JS: Cannot map type '${type}' for compare"`;
            }
        }
    }
}