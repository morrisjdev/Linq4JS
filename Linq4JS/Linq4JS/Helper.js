var Linq4JS;
(function (Linq4JS) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.ConvertStringFunction = function (functionString) {
            if (functionString.length == 0) {
                throw "Linq4JS: Cannot convert empty string to function";
            }
            var varname = functionString.substring(0, functionString.indexOf("=>")).replace(" ", "");
            if (varname.indexOf(",") != -1) {
                throw "Linq4JS: Cannot use '" + varname + "' as variable";
            }
            var func = functionString
                .substring(functionString.indexOf("=>") + 2)
                .split(".match(//gi)").join("");
            func = "return " + func;
            return Function(varname, func);
        };
        Helper.ConvertFunction = function (testFunction) {
            var result;
            if (typeof testFunction == "function") {
                result = testFunction;
            }
            else if (typeof testFunction == "string") {
                result = Linq4JS.Helper.ConvertStringFunction(testFunction);
            }
            else {
                throw "Linq4JS: Cannot use '" + testFunction + "' as function";
            }
            return result;
        };
        Helper.OrderCompareFunction = function (valueSelector, a, b, invert) {
            var value_a = valueSelector(a);
            var value_b = valueSelector(b);
            var type = typeof value_a;
            if (type == "string") {
                var value_a_string = value_a;
                value_a_string = value_a_string.toLowerCase();
                var value_b_string = value_b;
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
                var value_a_number = value_a;
                var value_b_number = value_b;
                return invert == true ? value_b_number - value_a_number : value_a_number - value_b_number;
            }
            else if (type == "boolean") {
                var value_a_bool = value_a;
                var value_b_bool = value_b;
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
                throw "Linq4JS: Cannot map type '" + type + "' for compare\"";
            }
        };
        return Helper;
    }());
    Linq4JS.Helper = Helper;
})(Linq4JS || (Linq4JS = {}));
//# sourceMappingURL=Helper.js.map