"use strict";
var Linq4JS;
(function (Linq4JS) {
    var GeneratedEntity = /** @class */ (function () {
        function GeneratedEntity() {
        }
        return GeneratedEntity;
    }());
    Linq4JS.GeneratedEntity = GeneratedEntity;
})(Linq4JS || (Linq4JS = {}));
var Linq4JS;
(function (Linq4JS) {
    var EvaluateCommand = /** @class */ (function () {
        function EvaluateCommand(command) {
            var identifier = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                identifier[_i - 1] = arguments[_i];
            }
            this.SplitRegex = [];
            this.Finder = [];
            this.Command = command;
            for (var _a = 0, identifier_1 = identifier; _a < identifier_1.length; _a++) {
                var id = identifier_1[_a];
                var sSplitRegex = void 0;
                var sFinder = void 0;
                if (id.indexOf("{x}") !== -1) {
                    if (id.indexOf("{x}") === id.length - 3) {
                        sSplitRegex = "\\b" + id.replace(" {x}", "") + "\\b";
                        sFinder = "\\b" + id.replace(" {x}", "\\b (.*)");
                    }
                    else {
                        sSplitRegex = "\\b" + id.replace(" {x}", "\\b .*? \\b") + "\\b";
                        sFinder = "\\b" + id.replace(" {x} ", "\\b (.*) \\b") + "\\b";
                    }
                }
                else {
                    sSplitRegex = "\\b" + id + "\\b";
                    sFinder = "\\b" + id + "\\b";
                }
                this.Finder.push(new RegExp(sFinder, "i"));
                this.SplitRegex.push(new RegExp(sSplitRegex, "gi"));
            }
        }
        return EvaluateCommand;
    }());
    Linq4JS.EvaluateCommand = EvaluateCommand;
    var EvaluateCommandResult = /** @class */ (function () {
        function EvaluateCommandResult(cmd, fn) {
            this.Command = cmd;
            this.DynamicFunction = fn;
        }
        return EvaluateCommandResult;
    }());
    Linq4JS.EvaluateCommandResult = EvaluateCommandResult;
})(Linq4JS || (Linq4JS = {}));
var Linq4JS;
(function (Linq4JS) {
    var Helper = /** @class */ (function () {
        function Helper() {
        }
        Helper.ConvertStringFunction = function (functionString, noAutoReturn, noBracketReplace) {
            if (functionString.length === 0) {
                throw new Error("Linq4JS: Cannot convert empty string to function");
            }
            var varnameString = functionString
                .substring(0, functionString.indexOf("=>"))
                .split(" ").join("")
                .split("(").join("")
                .split(")").join("");
            var varnames = varnameString.split(",");
            var func = functionString
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
            return Function.apply(void 0, varnames.concat([func]));
        };
        Helper.ConvertFunction = function (testFunction, noAutoReturn, noBracketReplace) {
            var result;
            if (typeof testFunction === "function") {
                result = testFunction;
            }
            else if (typeof testFunction === "string") {
                result = Linq4JS.Helper.ConvertStringFunction(testFunction, noAutoReturn, noBracketReplace);
            }
            else {
                throw new Error("Linq4JS: Cannot use '" + testFunction + "' as function");
            }
            return result;
        };
        Helper.OrderCompareFunction = function (valueSelector, a, b, invert) {
            var value_a = valueSelector(a);
            var value_b = valueSelector(b);
            var type_a = typeof value_a;
            var type_b = typeof value_b;
            if (type_a === "string" && type_a === type_b) {
                var value_a_string = value_a;
                value_a_string = value_a_string.toLowerCase();
                var value_b_string = value_b;
                value_b_string = value_b_string.toLowerCase();
                if (value_a_string > value_b_string) {
                    return invert === true ? -1 : 1;
                }
                else if (value_a_string < value_b_string) {
                    return invert === true ? 1 : -1;
                }
                else {
                    return 0;
                }
            }
            else if (type_a === "number" && type_a === type_b) {
                var value_a_number = value_a;
                var value_b_number = value_b;
                return invert === true ? value_b_number - value_a_number : value_a_number - value_b_number;
            }
            else if (type_a === "boolean" && type_a === type_b) {
                var value_a_bool = value_a;
                var value_b_bool = value_b;
                if (value_a_bool === value_b_bool) {
                    return 0;
                }
                else {
                    if (invert === true) {
                        return value_a_bool ? 1 : -1;
                    }
                    else {
                        return value_a_bool ? -1 : 1;
                    }
                }
            }
            else {
                if (type_a === "undefined" && type_a === type_b) {
                    return 0;
                }
                else if (type_a === "undefined") {
                    return invert ? 1 : -1;
                }
                else if (type_b === "undefined") {
                    return invert ? -1 : 1;
                }
                return 0;
            }
        };
        Helper.SplitCommand = function (command) {
            var splitIndexes = [];
            for (var _i = 0, _a = this.Commands; _i < _a.length; _i++) {
                var cmd = _a[_i];
                for (var _b = 0, _c = cmd.SplitRegex; _b < _c.length; _b++) {
                    var split = _c[_b];
                    while (true) {
                        var result = split.exec(command);
                        if (result != null) {
                            splitIndexes.push(result.index);
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            var parts = [];
            splitIndexes = splitIndexes.Distinct().OrderBy(function (x) { return x; });
            for (var i = 0; i < splitIndexes.length; i++) {
                if (i === splitIndexes.length - 1) {
                    parts.push(command.substr(splitIndexes[i]));
                }
                else {
                    parts.push(command.substr(splitIndexes[i], splitIndexes[i + 1] - splitIndexes[i]));
                }
            }
            return parts;
        };
        Helper.MatchCommand = function (cmd) {
            for (var _i = 0, _a = this.Commands; _i < _a.length; _i++) {
                var command = _a[_i];
                for (var _b = 0, _c = command.Finder; _b < _c.length; _b++) {
                    var regex = _c[_b];
                    var result = cmd.match(regex);
                    if (result != null) {
                        return new Linq4JS.EvaluateCommandResult(command.Command, result[1]);
                    }
                }
            }
            throw new Error("Linq4JS: No matching command was found for '" + cmd + "'");
        };
        Helper.NonEnumerable = function (name, value) {
            Object.defineProperty(Array.prototype, name, {
                value: value,
                enumerable: false
            });
        };
        Helper.Commands = [
            new Linq4JS.EvaluateCommand("Clone", "clone"),
            new Linq4JS.EvaluateCommand("Reverse", "reverse"),
            new Linq4JS.EvaluateCommand("Contains", "contains {x}"),
            new Linq4JS.EvaluateCommand("Join", "join {x}"),
            new Linq4JS.EvaluateCommand("Sum", "sum {x}", "sum"),
            new Linq4JS.EvaluateCommand("Average", "average {x}", "average"),
            new Linq4JS.EvaluateCommand("Where", "where {x}"),
            new Linq4JS.EvaluateCommand("SelectMany", "selectmany {x}", "select many {x}", "select {x} many"),
            new Linq4JS.EvaluateCommand("Select", "select {x}"),
            new Linq4JS.EvaluateCommand("Get", "get {x}"),
            new Linq4JS.EvaluateCommand("ForEach", "foreach {x}", "for each {x}"),
            new Linq4JS.EvaluateCommand("Count", "count", "count {x}"),
            new Linq4JS.EvaluateCommand("All", "all {x}"),
            new Linq4JS.EvaluateCommand("Any", "any {x}", "any"),
            new Linq4JS.EvaluateCommand("TakeWhile", "take while {x}", "take {x} while", "takewhile {x}"),
            new Linq4JS.EvaluateCommand("Take", "take {x}"),
            new Linq4JS.EvaluateCommand("Skip", "skip {x}"),
            new Linq4JS.EvaluateCommand("Min", "min {x}", "min"),
            new Linq4JS.EvaluateCommand("Max", "max {x}", "max"),
            new Linq4JS.EvaluateCommand("GroupBy", "groupby {x}", "group by {x}"),
            new Linq4JS.EvaluateCommand("Distinct", "distinct {x}", "distinct"),
            new Linq4JS.EvaluateCommand("FindLastIndex", "findlastindex {x}", "find last index {x}", "findindex {x} last", "find index {x} last"),
            new Linq4JS.EvaluateCommand("FindIndex", "findfirstindex {x}", "find first index {x}", "findindex {x} first", "find index {x} first", "findindex {x}", "find index {x}"),
            new Linq4JS.EvaluateCommand("OrderByDescending", "orderby {x} descending", "order by {x} descending", "orderby descending {x}", "orderbydescending {x}", "order by descending {x}"),
            new Linq4JS.EvaluateCommand("OrderBy", "orderby {x} ascending", "order by {x} ascending", "orderbyascending {x}", "order by ascending {x}", "orderby {x}", "order by {x}"),
            new Linq4JS.EvaluateCommand("FirstOrDefault", "firstordefault {x}", "first or default {x}", "firstordefault", "first or default"),
            new Linq4JS.EvaluateCommand("LastOrDefault", "lastordefault {x}", "last or default {x}", "lastordefault", "last or default"),
            new Linq4JS.EvaluateCommand("SingleOrDefault", "singleordefault {x}", "single or default {x}", "singleordefault", "single or default"),
            new Linq4JS.EvaluateCommand("First", "first {x}", "first"),
            new Linq4JS.EvaluateCommand("Last", "last {x}", "last"),
            new Linq4JS.EvaluateCommand("Single", "single {x}", "single"),
            new Linq4JS.EvaluateCommand("ThenByDescending", "thenby {x} descending", "then by {x} descending", "thenbydescending {x}", "then by descending {x}"),
            new Linq4JS.EvaluateCommand("ThenBy", "thenby {x} ascending", "then by {x} ascending", "thenbyascending {x}", "then by ascending {x}", "thenby {x}", "then by {x}")
        ];
        return Helper;
    }());
    Linq4JS.Helper = Helper;
})(Linq4JS || (Linq4JS = {}));
Object.defineProperty(Array.prototype, "_linq4js_", {
    value: { Order: [] },
    enumerable: false
});
var Linq4JS;
(function (Linq4JS) {
    var OrderEntry = /** @class */ (function () {
        function OrderEntry(_direction, _valueSelector) {
            this.Direction = _direction;
            this.ValueSelector = _valueSelector;
        }
        return OrderEntry;
    }());
    Linq4JS.OrderEntry = OrderEntry;
    var OrderDirection;
    (function (OrderDirection) {
        OrderDirection[OrderDirection["Ascending"] = 0] = "Ascending";
        OrderDirection[OrderDirection["Descending"] = 1] = "Descending";
    })(OrderDirection = Linq4JS.OrderDirection || (Linq4JS.OrderDirection = {}));
})(Linq4JS || (Linq4JS = {}));
var Linq4JS;
(function (Linq4JS) {
    var SelectEntry = /** @class */ (function () {
        function SelectEntry(n, p) {
            this.name = n;
            this.property = p;
        }
        return SelectEntry;
    }());
    Linq4JS.SelectEntry = SelectEntry;
})(Linq4JS || (Linq4JS = {}));
Linq4JS.Helper.NonEnumerable("Add", function (object, generateId) {
    if (object != null) {
        if (generateId === true) {
            var newIndex_1;
            var castedObject = object;
            var last = this.Where(function (x) { return x._GeneratedId_ != null; }).OrderBy(function (x) { return x._GeneratedId_; }).LastOrDefault();
            if (last != null) {
                newIndex_1 = last._GeneratedId_ != null ? last._GeneratedId_ : 1;
                while (this.Any(function (x) {
                    return x._GeneratedId_ === newIndex_1;
                })) {
                    newIndex_1++;
                }
                castedObject._GeneratedId_ = newIndex_1;
            }
            else {
                castedObject._GeneratedId_ = 1;
            }
        }
        this.push(object);
    }
    return this;
});
Linq4JS.Helper.NonEnumerable("AddRange", function (objects, generateId) {
    var that = this;
    objects.ForEach(function (x) {
        that.Add(x, generateId);
    });
    return that;
});
Linq4JS.Helper.NonEnumerable("Aggregate", function (method, startVal) {
    var result;
    if (startVal != null) {
        result = startVal;
    }
    else {
        result = "";
    }
    var methodFunction = Linq4JS.Helper.ConvertFunction(method);
    this.ForEach(function (x) {
        result = methodFunction(result, x);
    });
    return result;
});
Linq4JS.Helper.NonEnumerable("All", function (filter) {
    return this.Count(filter) === this.Count();
});
Linq4JS.Helper.NonEnumerable("Any", function (filter) {
    return this.Count(filter) > 0;
});
Linq4JS.Helper.NonEnumerable("Average", function (selector, filter) {
    var result = 0;
    var array = this;
    if (filter != null) {
        array = array.Where(filter);
    }
    if (selector != null) {
        array = array.Select(selector);
    }
    array.ForEach(function (x) {
        result += x;
    });
    return result / array.Count();
});
Linq4JS.Helper.NonEnumerable("Clone", function () {
    var newArray = [];
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var obj = _a[_i];
        newArray.Add(obj);
    }
    return newArray;
});
Linq4JS.Helper.NonEnumerable("Concat", function (array) {
    return this.concat(array);
});
Linq4JS.Helper.NonEnumerable("Contains", function (object) {
    return this.Any(function (x) {
        return x === object;
    });
});
Linq4JS.Helper.NonEnumerable("Count", function (filter) {
    if (filter != null) {
        return this.Where(filter).length;
    }
    else {
        return this.length;
    }
});
Linq4JS.Helper.NonEnumerable("Distinct", function (valueSelector) {
    var that = this;
    if (valueSelector != null) {
        var valueSelectorFunction_1 = Linq4JS.Helper.ConvertFunction(valueSelector);
        return this.Where(function (x, i) {
            return that.FindIndex(function (y) { return valueSelectorFunction_1(y) === valueSelectorFunction_1(x); }) === i;
        });
    }
    else {
        return this.Where(function (x, i) {
            return that.FindIndex(function (y) { return y === x; }) === i;
        });
    }
});
Linq4JS.Helper.NonEnumerable("Evaluate", function (command) {
    var commandParts = Linq4JS.Helper.SplitCommand(command);
    var computeObject = this;
    for (var _i = 0, commandParts_1 = commandParts; _i < commandParts_1.length; _i++) {
        var cmd = commandParts_1[_i];
        var cmdResult = Linq4JS.Helper.MatchCommand(cmd);
        computeObject = computeObject[cmdResult.Command](cmdResult.DynamicFunction);
    }
    return computeObject;
});
Linq4JS.Helper.NonEnumerable("FindIndex", function (filter) {
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        for (var i = 0; i < this.length; i++) {
            var obj = this[i];
            if (filterFunction(obj) === true) {
                return i;
            }
        }
        return -1;
    }
    else {
        throw new Error("Linq4JS: You must define a filter");
    }
});
Linq4JS.Helper.NonEnumerable("FindLastIndex", function (filter) {
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        for (var i = this.length - 1; i >= 0; i--) {
            var obj = this[i];
            if (filterFunction(obj) === true) {
                return i;
            }
        }
        return -1;
    }
    else {
        throw new Error("Linq4JS: You must define a filter");
    }
});
Linq4JS.Helper.NonEnumerable("First", function (filter) {
    if (filter != null) {
        var result = this.Where(filter);
        if (result.Any()) {
            return result.Get(0);
        }
        else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    }
    else {
        if (this.Any()) {
            return this.Get(0);
        }
        else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    }
});
Linq4JS.Helper.NonEnumerable("FirstOrDefault", function (filter) {
    if (filter != null) {
        var result = this.Where(filter);
        if (result.Any()) {
            return result.Get(0);
        }
        else {
            return null;
        }
    }
    else {
        if (this.Any()) {
            return this.Get(0);
        }
        else {
            return null;
        }
    }
});
Linq4JS.Helper.NonEnumerable("ForEach", function (action) {
    var actionFunction = Linq4JS.Helper.ConvertFunction(action, true);
    for (var i = 0; i < this.length; i++) {
        var result = actionFunction(this[i], i);
        if (result != null && result === true) {
            break;
        }
    }
    return this;
});
Linq4JS.Helper.NonEnumerable("Get", function (index) {
    return this[index];
});
Linq4JS.Helper.NonEnumerable("GroupBy", function (selector) {
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selector);
    var newArray = [];
    var ordered = this.OrderBy(selectorFunction);
    var prev;
    var newSub = [];
    ordered.ForEach(function (x) {
        if (prev != null) {
            if (selectorFunction(prev) !== selectorFunction(x)) {
                newArray.Add(newSub);
                newSub = [];
                newSub._linq4js_.GroupValue = selectorFunction(x);
            }
        }
        else {
            newSub._linq4js_.GroupValue = selectorFunction(x);
        }
        newSub.Add(x);
        prev = x;
    });
    if (newSub.Count() > 0) {
        newArray.Add(newSub);
    }
    return newArray;
});
Linq4JS.Helper.NonEnumerable("Insert", function (object, index) {
    this.splice(index, 0, object);
    return this;
});
Linq4JS.Helper.NonEnumerable("Intersect", function (array) {
    var that = this;
    var newArray = [];
    this.ForEach(function (x) {
        if (array.Contains(x)) {
            newArray.Add(x);
        }
    });
    array.ForEach(function (x) {
        if (that.Contains(x)) {
            newArray.Add(x);
        }
    });
    return newArray.Distinct();
});
Linq4JS.Helper.NonEnumerable("Join", function (char, selector) {
    var array = this;
    if (selector != null) {
        array = this.Select(selector);
    }
    return array.join(char);
});
Linq4JS.Helper.NonEnumerable("Last", function (filter) {
    if (filter != null) {
        var result = this.Where(filter);
        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    }
    else {
        if (this.Any()) {
            return this.Get(this.length - 1);
        }
        else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    }
});
Linq4JS.Helper.NonEnumerable("LastOrDefault", function (filter) {
    if (filter != null) {
        var result = this.Where(filter);
        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            return null;
        }
    }
    else {
        if (this.Any()) {
            return this.Get(this.length - 1);
        }
        else {
            return null;
        }
    }
});
Linq4JS.Helper.NonEnumerable("Max", function (valueSelector) {
    if (valueSelector != null) {
        var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
        return this.OrderBy(valueSelectorFunction).LastOrDefault();
    }
    else {
        return this.OrderBy(function (x) { return x; }).LastOrDefault();
    }
});
Linq4JS.Helper.NonEnumerable("Min", function (valueSelector) {
    if (valueSelector != null) {
        var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
        return this.OrderBy(valueSelectorFunction).FirstOrDefault();
    }
    else {
        return this.OrderBy(function (x) { return x; }).FirstOrDefault();
    }
});
Linq4JS.Helper.NonEnumerable("Move", function (oldIndex, newIndex) {
    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
    return this;
});
Linq4JS.Helper.NonEnumerable("OrderBy", function (valueSelector) {
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = this.Clone();
    ordered._linq4js_.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, false);
    });
});
Linq4JS.Helper.NonEnumerable("OrderByDescending", function (valueSelector) {
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = this.Clone();
    ordered._linq4js_.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, true);
    });
});
Linq4JS.Helper.NonEnumerable("Range", function (start, length) {
    var newArray = [];
    for (var i = start; i < start + length; i++) {
        newArray.Add(this.Get(i));
    }
    return newArray;
});
Linq4JS.Helper.NonEnumerable("Remove", function (object, primaryKeySelector) {
    var targetIndex;
    if (object == null) {
        throw new Error("Linq4JS: The object cannot be null");
    }
    var castedObject = object;
    if (primaryKeySelector != null) {
        var selector_1 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = this.FindIndex(function (x) {
            return selector_1(x) === selector_1(object);
        });
    }
    else if (castedObject._GeneratedId_ != null) {
        targetIndex = this.FindIndex(function (x) {
            return x._GeneratedId_ === castedObject._GeneratedId_;
        });
    }
    else if (castedObject.Id != null) {
        targetIndex = this.FindIndex(function (x) {
            return x.Id === castedObject.Id;
        });
    }
    else {
        targetIndex = this.FindIndex(function (x) {
            return x === object;
        });
    }
    if (targetIndex !== -1) {
        this.splice(targetIndex, 1);
    }
    else {
        throw new Error("Linq4JS: Nothing found to Remove");
    }
    return this;
});
Linq4JS.Helper.NonEnumerable("RemoveRange", function (objects, primaryKeySelector) {
    var that = this;
    if (primaryKeySelector != null) {
        var selector_2 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        objects.ForEach(function (x) {
            that.Remove(x, selector_2);
        });
    }
    else {
        objects.ForEach(function (x) {
            that.Remove(x);
        });
    }
    return that;
});
Linq4JS.Helper.NonEnumerable("Repeat", function (object, count) {
    for (var i = 0; i < count; i++) {
        this.Add(object);
    }
    return this;
});
Linq4JS.Helper.NonEnumerable("Reverse", function () {
    return this.reverse();
});
Linq4JS.Helper.NonEnumerable("Select", function (selector) {
    var selectorWork = selector;
    if (typeof selectorWork === "string") {
        var selectStatement = selectorWork.substr(selectorWork.indexOf("=>") + ("=>").length);
        if (selectStatement.match(/^\s*{.*}\s*$/) != null) {
            selectStatement = selectStatement.replace(/^\s*{(.*)}\s*$/, "$1");
            var parts = selectStatement.split(/,(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/g);
            var newContent = "";
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (part.indexOf(":") !== -1) {
                    newContent += part;
                }
                else if (part.indexOf("=") !== -1) {
                    newContent += part.replace("=", ":");
                }
                else {
                    var values = part.split(".");
                    var name_1 = values[values.length - 1];
                    newContent += name_1 + ":" + part;
                }
                if (i < parts.length - 1) {
                    newContent += ",";
                }
            }
            selectorWork = selectorWork.substr(0, selectorWork.indexOf("=>")) + "=> return {" + newContent + "}";
        }
    }
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selectorWork, false, true);
    var newArray = new Array();
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var obj = _a[_i];
        newArray.Add(selectorFunction(obj));
    }
    return newArray;
});
Linq4JS.Helper.NonEnumerable("SelectMany", function (selector) {
    var newArray = new Array();
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selector);
    this.ForEach(function (item) {
        var items = selectorFunction(item) || [];
        newArray.AddRange(items);
    });
    return newArray;
});
Linq4JS.Helper.NonEnumerable("SequenceEqual", function (array) {
    if (this.Count() !== array.Count()) {
        return false;
    }
    for (var i = 0; i < this.length; i++) {
        var keys = Object.keys(this[i]);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (this[i][key] !== array[i][key]) {
                return false;
            }
        }
    }
    return true;
});
Linq4JS.Helper.NonEnumerable("Single", function (filter) {
    if (filter != null) {
        var result = this.Where(filter);
        if (result.Count() === 1) {
            return result.Get(0);
        }
        else {
            throw new Error("Linq4JS: The array does not contain exactly one element");
        }
    }
    else {
        if (this.Count() === 1) {
            return this.Get(0);
        }
        else {
            throw new Error("Linq4JS: The array does not contain exactly one element");
        }
    }
});
Linq4JS.Helper.NonEnumerable("SingleOrDefault", function (filter) {
    if (filter != null) {
        var result = this.Where(filter);
        if (result.Count() === 1) {
            return result.Get(0);
        }
        else {
            if (result.Count() > 1) {
                throw new Error("Linq4JS: The array contains more than one element");
            }
            else {
                return null;
            }
        }
    }
    else {
        if (this.Count() === 1) {
            return this.Get(0);
        }
        else {
            if (this.Count() > 1) {
                throw new Error("Linq4JS: The array contains more than one element");
            }
            else {
                return null;
            }
        }
    }
});
Linq4JS.Helper.NonEnumerable("Skip", function (count) {
    return this.slice(count, this.Count());
});
Linq4JS.Helper.NonEnumerable("Sum", function (selector, filter) {
    var result = 0;
    var array = this;
    if (filter != null) {
        array = array.Where(filter);
    }
    if (selector != null) {
        array = array.Select(selector);
    }
    array.ForEach(function (x) {
        result += x;
    });
    return result;
});
Linq4JS.Helper.NonEnumerable("Take", function (count) {
    return this.slice(0, count);
});
Linq4JS.Helper.NonEnumerable("TakeWhile", function (condition, initial, after) {
    var conditionFunction = Linq4JS.Helper.ConvertFunction(condition);
    var storage = {};
    if (initial != null) {
        var initialFunction = Linq4JS.Helper.ConvertFunction(initial);
        initialFunction(storage);
    }
    var afterFunction = null;
    if (after != null) {
        afterFunction = Linq4JS.Helper.ConvertFunction(after);
    }
    var result = [];
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var object = _a[_i];
        if (conditionFunction(object, storage) === true) {
            result.Add(object);
            if (afterFunction != null) {
                afterFunction(object, storage);
            }
        }
    }
    return result;
});
Linq4JS.Helper.NonEnumerable("ThenBy", function (valueSelector) {
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    if (this._linq4js_.Order == null || this._linq4js_.Order.Count() === 0) {
        throw new Error("Linq4JS: Please call OrderBy or OrderByDescending before ThenBy");
    }
    var ordered = this;
    ordered._linq4js_.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered._linq4js_.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction === Linq4JS.OrderDirection.Descending);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
});
Linq4JS.Helper.NonEnumerable("ThenByDescending", function (valueSelector) {
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    if (this._linq4js_.Order == null || this._linq4js_.Order.Count() === 0) {
        throw new Error("Linq4JS: Please call OrderBy or OrderByDescending before ThenByDescending");
    }
    var ordered = this;
    ordered._linq4js_.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered._linq4js_.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction === Linq4JS.OrderDirection.Descending);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
});
Linq4JS.Helper.NonEnumerable("ToDictionary", function (keySelector, valueSelector) {
    var keySelectorFunction = Linq4JS.Helper.ConvertFunction(keySelector);
    var returnObject = {};
    if (valueSelector != null) {
        var valueSelectorFunction_2 = Linq4JS.Helper.ConvertFunction(valueSelector);
        this.ForEach(function (x) {
            returnObject[keySelectorFunction(x)] = valueSelectorFunction_2(x);
        });
    }
    else {
        this.ForEach(function (x) {
            returnObject[keySelectorFunction(x)] = x;
        });
    }
    return returnObject;
});
Linq4JS.Helper.NonEnumerable("Union", function (array) {
    return this.Concat(array).Distinct();
});
Linq4JS.Helper.NonEnumerable("Update", function (object, primaryKeySelector) {
    var targetIndex;
    if (object == null) {
        throw new Error("Linq4JS: The object cannot be null");
    }
    var castedObject = object;
    if (primaryKeySelector != null) {
        var selector_3 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = this.FindIndex(function (x) {
            return selector_3(x) === selector_3(object);
        });
    }
    else if (castedObject._GeneratedId_ != null) {
        targetIndex = this.FindIndex(function (x) {
            return x._GeneratedId_ === castedObject._GeneratedId_;
        });
    }
    else if (castedObject.Id != null) {
        targetIndex = this.FindIndex(function (x) {
            return x.Id === castedObject.Id;
        });
    }
    else {
        targetIndex = this.FindIndex(function (x) {
            return x === object;
        });
    }
    if (targetIndex !== -1) {
        var keys = Object.keys(object);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            if (key !== "Id") {
                this[targetIndex][key] = object[key];
            }
        }
    }
    else {
        throw new Error("Linq4JS: Nothing found to Update");
    }
    return this;
});
Linq4JS.Helper.NonEnumerable("UpdateRange", function (objects, primaryKeySelector) {
    var that = this;
    if (primaryKeySelector != null) {
        var selector_4 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        objects.ForEach(function (x) {
            that.Update(x, selector_4);
        });
    }
    else {
        objects.ForEach(function (x) {
            that.Update(x);
        });
    }
    return this;
});
Linq4JS.Helper.NonEnumerable("Where", function (filter) {
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        var newArray = [];
        for (var i = 0; i < this.length; i++) {
            var obj = this[i];
            if (filterFunction(obj, i) === true) {
                newArray.push(obj);
            }
        }
        return newArray;
    }
    else {
        throw new Error("Linq4JS: You must define a filter");
    }
});
Linq4JS.Helper.NonEnumerable("Zip", function (array, result) {
    var resultFunction = Linq4JS.Helper.ConvertFunction(result);
    var newArray = new Array();
    for (var i = 0; i < this.length; i++) {
        if (array[i] != null) {
            newArray.Add(resultFunction(this[i], array[i]));
        }
    }
    return newArray;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi9FbnRpdHkudHMiLCJkZXYvRXZhbHVhdGVDb21tYW5kLnRzIiwiZGV2L0hlbHBlci50cyIsImRldi9PcmRlckVudHJ5LnRzIiwiZGV2L1NlbGVjdEVudHJ5LnRzIiwiZGV2L01vZHVsZXMvQWRkLnRzIiwiZGV2L01vZHVsZXMvQWRkUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9BZ2dyZWdhdGUudHMiLCJkZXYvTW9kdWxlcy9BbGwudHMiLCJkZXYvTW9kdWxlcy9BbnkudHMiLCJkZXYvTW9kdWxlcy9BdmVyYWdlLnRzIiwiZGV2L01vZHVsZXMvQ2xvbmUudHMiLCJkZXYvTW9kdWxlcy9Db25jYXQudHMiLCJkZXYvTW9kdWxlcy9Db250YWlucy50cyIsImRldi9Nb2R1bGVzL0NvdW50LnRzIiwiZGV2L01vZHVsZXMvRGlzdGluY3QudHMiLCJkZXYvTW9kdWxlcy9FdmFsdWF0ZS50cyIsImRldi9Nb2R1bGVzL0ZpbmRJbmRleC50cyIsImRldi9Nb2R1bGVzL0ZpbmRMYXN0SW5kZXgudHMiLCJkZXYvTW9kdWxlcy9GaXJzdC50cyIsImRldi9Nb2R1bGVzL0ZpcnN0T3JEZWZhdWx0LnRzIiwiZGV2L01vZHVsZXMvRm9yRWFjaC50cyIsImRldi9Nb2R1bGVzL0dldC50cyIsImRldi9Nb2R1bGVzL0dyb3VwQnkudHMiLCJkZXYvTW9kdWxlcy9JbnNlcnQudHMiLCJkZXYvTW9kdWxlcy9JbnRlcnNlY3QudHMiLCJkZXYvTW9kdWxlcy9Kb2luLnRzIiwiZGV2L01vZHVsZXMvTGFzdC50cyIsImRldi9Nb2R1bGVzL0xhc3RPckRlZmF1bHQudHMiLCJkZXYvTW9kdWxlcy9NYXgudHMiLCJkZXYvTW9kdWxlcy9NaW4udHMiLCJkZXYvTW9kdWxlcy9Nb3ZlLnRzIiwiZGV2L01vZHVsZXMvT3JkZXJCeS50cyIsImRldi9Nb2R1bGVzL09yZGVyQnlEZXNjZW5kaW5nLnRzIiwiZGV2L01vZHVsZXMvUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9SZW1vdmUudHMiLCJkZXYvTW9kdWxlcy9SZW1vdmVSYW5nZS50cyIsImRldi9Nb2R1bGVzL1JlcGVhdC50cyIsImRldi9Nb2R1bGVzL1JldmVyc2UudHMiLCJkZXYvTW9kdWxlcy9TZWxlY3QudHMiLCJkZXYvTW9kdWxlcy9TZWxlY3RNYW55LnRzIiwiZGV2L01vZHVsZXMvU2VxdWVuY2VFcXVhbC50cyIsImRldi9Nb2R1bGVzL1NpbmdsZS50cyIsImRldi9Nb2R1bGVzL1NpbmdsZU9yRGVmYXVsdC50cyIsImRldi9Nb2R1bGVzL1NraXAudHMiLCJkZXYvTW9kdWxlcy9TdW0udHMiLCJkZXYvTW9kdWxlcy9UYWtlLnRzIiwiZGV2L01vZHVsZXMvVGFrZVdoaWxlLnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5LnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1RvRGljdGlvbmFyeS50cyIsImRldi9Nb2R1bGVzL1VuaW9uLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9XaGVyZS50cyIsImRldi9Nb2R1bGVzL1ppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxPQUFPLENBS2hCO0FBTEQsV0FBVSxPQUFPO0lBQ2I7UUFBQTtRQUdBLENBQUM7UUFBRCxzQkFBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksdUJBQWUsa0JBRzNCLENBQUE7QUFDTCxDQUFDLEVBTFMsT0FBTyxLQUFQLE9BQU8sUUFLaEI7QUNMRCxJQUFVLE9BQU8sQ0F5Q2hCO0FBekNELFdBQVUsT0FBTztJQUNiO1FBS0kseUJBQVksT0FBZTtZQUFFLG9CQUF1QjtpQkFBdkIsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO2dCQUF2QixtQ0FBdUI7O1lBSDdDLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFDMUIsV0FBTSxHQUFhLEVBQUUsQ0FBQztZQUd6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixH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QUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoibGlucTRqcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBHZW5lcmF0ZWRFbnRpdHkge1xyXG4gICAgICAgIHB1YmxpYyBfR2VuZXJhdGVkSWRfOiBudW1iZXI7XHJcbiAgICAgICAgcHVibGljIElkOiBudW1iZXI7XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgTGlucTRKUyB7XHJcbiAgICBleHBvcnQgY2xhc3MgRXZhbHVhdGVDb21tYW5kIHtcclxuICAgICAgICBwdWJsaWMgQ29tbWFuZDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBTcGxpdFJlZ2V4OiBSZWdFeHBbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBGaW5kZXI6IFJlZ0V4cFtdID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbW1hbmQ6IHN0cmluZywgLi4uaWRlbnRpZmllcjogc3RyaW5nW10pIHtcclxuICAgICAgICAgICAgdGhpcy5Db21tYW5kID0gY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGlkIG9mIGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzU3BsaXRSZWdleDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNGaW5kZXI6IHN0cmluZztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWQuaW5kZXhPZihcInt4fVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5kZXhPZihcInt4fVwiKSA9PT0gaWQubGVuZ3RoIC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzU3BsaXRSZWdleCA9IFwiXFxcXGJcIiArIGlkLnJlcGxhY2UoXCIge3h9XCIsIFwiXCIpICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzRmluZGVyID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH1cIiwgXCJcXFxcYiAoLiopXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNTcGxpdFJlZ2V4ID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH1cIiwgXCJcXFxcYiAuKj8gXFxcXGJcIikgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNGaW5kZXIgPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fSBcIiwgXCJcXFxcYiAoLiopIFxcXFxiXCIpICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc1NwbGl0UmVnZXggPSBcIlxcXFxiXCIgKyBpZCArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgICAgICBzRmluZGVyID0gXCJcXFxcYlwiICsgaWQgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5GaW5kZXIucHVzaChuZXcgUmVnRXhwKHNGaW5kZXIsIFwiaVwiKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNwbGl0UmVnZXgucHVzaChuZXcgUmVnRXhwKHNTcGxpdFJlZ2V4LCBcImdpXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZhbHVhdGVDb21tYW5kUmVzdWx0IHtcclxuICAgICAgICBwdWJsaWMgQ29tbWFuZDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBEeW5hbWljRnVuY3Rpb246IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY21kOiBzdHJpbmcsIGZuOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5Db21tYW5kID0gY21kO1xyXG4gICAgICAgICAgICB0aGlzLkR5bmFtaWNGdW5jdGlvbiA9IGZuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBIZWxwZXIge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIENvbnZlcnRTdHJpbmdGdW5jdGlvbihmdW5jdGlvblN0cmluZzogc3RyaW5nLCBub0F1dG9SZXR1cm4/OiBib29sZWFuLCBub0JyYWNrZXRSZXBsYWNlPzogYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgICAgIGlmIChmdW5jdGlvblN0cmluZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IENhbm5vdCBjb252ZXJ0IGVtcHR5IHN0cmluZyB0byBmdW5jdGlvblwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHZhcm5hbWVTdHJpbmc6IHN0cmluZyA9IGZ1bmN0aW9uU3RyaW5nXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDAsIGZ1bmN0aW9uU3RyaW5nLmluZGV4T2YoXCI9PlwiKSlcclxuICAgICAgICAgICAgICAgIC5zcGxpdChcIiBcIikuam9pbihcIlwiKVxyXG4gICAgICAgICAgICAgICAgLnNwbGl0KFwiKFwiKS5qb2luKFwiXCIpXHJcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCIpXCIpLmpvaW4oXCJcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFybmFtZXM6IHN0cmluZ1tdID0gdmFybmFtZVN0cmluZy5zcGxpdChcIixcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZnVuYzogc3RyaW5nID0gZnVuY3Rpb25TdHJpbmdcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoZnVuY3Rpb25TdHJpbmcuaW5kZXhPZihcIj0+XCIpICsgKFwiPT5cIikubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub0JyYWNrZXRSZXBsYWNlID09IG51bGwgfHwgbm9CcmFja2V0UmVwbGFjZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMucmVwbGFjZShcIntcIiwgXCJcIikucmVwbGFjZShcIn1cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmMuc3BsaXQoXCIubWF0Y2goLy9naSlcIikuam9pbihcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub0F1dG9SZXR1cm4gPT0gbnVsbCB8fCBub0F1dG9SZXR1cm4gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAvKk5vIHJldHVybiBvdXRzaWRlIG9mIHF1b3RhdGlvbnMqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMubWF0Y2goL3JldHVybig/PShbXlxcXCInXSpbXFxcIiddW15cXFwiJ10qW1xcXCInXSkqW15cXFwiJ10qJCkvZykgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBcInJldHVybiBcIiArIGZ1bmM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbiguLi52YXJuYW1lcywgZnVuYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENvbnZlcnRGdW5jdGlvbjxUPih0ZXN0RnVuY3Rpb246IHN0cmluZyB8IFQsIG5vQXV0b1JldHVybj86IGJvb2xlYW4sIG5vQnJhY2tldFJlcGxhY2U/OiBib29sZWFuKTogVCB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IFQ7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRlc3RGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0ZXN0RnVuY3Rpb247XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlc3RGdW5jdGlvbiA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTGlucTRKUy5IZWxwZXIuQ29udmVydFN0cmluZ0Z1bmN0aW9uKHRlc3RGdW5jdGlvbiwgbm9BdXRvUmV0dXJuLCBub0JyYWNrZXRSZXBsYWNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTGlucTRKUzogQ2Fubm90IHVzZSAnJHt0ZXN0RnVuY3Rpb259JyBhcyBmdW5jdGlvbmApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBPcmRlckNvbXBhcmVGdW5jdGlvbjxUPih2YWx1ZVNlbGVjdG9yOiAoaXRlbTogVCkgPT4gYW55LCBhOiBULCBiOiBULCBpbnZlcnQ6IGJvb2xlYW4pOiBudW1iZXIge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVfYTogYW55ID0gdmFsdWVTZWxlY3RvcihhKTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlX2I6IGFueSA9IHZhbHVlU2VsZWN0b3IoYik7XHJcblxyXG4gICAgICAgICAgICBsZXQgdHlwZV9hOiBzdHJpbmcgPSB0eXBlb2YgdmFsdWVfYTtcclxuICAgICAgICAgICAgbGV0IHR5cGVfYjogc3RyaW5nID0gdHlwZW9mIHZhbHVlX2I7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZV9hID09PSBcInN0cmluZ1wiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYV9zdHJpbmc6IHN0cmluZyA9IHZhbHVlX2E7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZV9hX3N0cmluZyA9IHZhbHVlX2Ffc3RyaW5nLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYl9zdHJpbmc6IHN0cmluZyA9IHZhbHVlX2I7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZV9iX3N0cmluZyA9IHZhbHVlX2Jfc3RyaW5nLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlX2Ffc3RyaW5nID4gdmFsdWVfYl9zdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID09PSB0cnVlID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZV9hX3N0cmluZyA8IHZhbHVlX2Jfc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA9PT0gdHJ1ZSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlX2EgPT09IHR5cGVfYikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2FfbnVtYmVyOiBudW1iZXIgPSB2YWx1ZV9hO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2JfbnVtYmVyOiBudW1iZXIgPSB2YWx1ZV9iO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPT09IHRydWUgPyB2YWx1ZV9iX251bWJlciAtIHZhbHVlX2FfbnVtYmVyIDogdmFsdWVfYV9udW1iZXIgLSB2YWx1ZV9iX251bWJlcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlX2EgPT09IFwiYm9vbGVhblwiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYV9ib29sOiBib29sZWFuID0gdmFsdWVfYTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9iX2Jvb2w6IGJvb2xlYW4gPSB2YWx1ZV9iO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZV9hX2Jvb2wgPT09IHZhbHVlX2JfYm9vbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW52ZXJ0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZV9hX2Jvb2wgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlX2FfYm9vbCA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZV9hID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3BsaXRDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgbGV0IHNwbGl0SW5kZXhlczogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNtZCBvZiB0aGlzLkNvbW1hbmRzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzcGxpdCBvZiBjbWQuU3BsaXRSZWdleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBzcGxpdC5leGVjKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0SW5kZXhlcy5wdXNoKHJlc3VsdC5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc3BsaXRJbmRleGVzID0gc3BsaXRJbmRleGVzLkRpc3RpbmN0KCkuT3JkZXJCeSh4ID0+IHgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdEluZGV4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzcGxpdEluZGV4ZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY29tbWFuZC5zdWJzdHIoc3BsaXRJbmRleGVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY29tbWFuZC5zdWJzdHIoc3BsaXRJbmRleGVzW2ldLCBzcGxpdEluZGV4ZXNbaSArIDFdIC0gc3BsaXRJbmRleGVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJ0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTWF0Y2hDb21tYW5kKGNtZDogc3RyaW5nKTogRXZhbHVhdGVDb21tYW5kUmVzdWx0IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbW1hbmQgb2YgdGhpcy5Db21tYW5kcykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlZ2V4IG9mIGNvbW1hbmQuRmluZGVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gY21kLm1hdGNoKHJlZ2V4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXZhbHVhdGVDb21tYW5kUmVzdWx0KGNvbW1hbmQuQ29tbWFuZCwgcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExpbnE0SlM6IE5vIG1hdGNoaW5nIGNvbW1hbmQgd2FzIGZvdW5kIGZvciAnJHtjbWR9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDb21tYW5kczogRXZhbHVhdGVDb21tYW5kW10gPSBbXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJDbG9uZVwiLCBcImNsb25lXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiUmV2ZXJzZVwiLCBcInJldmVyc2VcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJDb250YWluc1wiLCBcImNvbnRhaW5zIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkpvaW5cIiwgXCJqb2luIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlN1bVwiLCBcInN1bSB7eH1cIiwgXCJzdW1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJBdmVyYWdlXCIsIFwiYXZlcmFnZSB7eH1cIiwgXCJhdmVyYWdlXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiV2hlcmVcIiwgXCJ3aGVyZSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTZWxlY3RNYW55XCIsIFwic2VsZWN0bWFueSB7eH1cIiwgXCJzZWxlY3QgbWFueSB7eH1cIiwgXCJzZWxlY3Qge3h9IG1hbnlcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTZWxlY3RcIiwgXCJzZWxlY3Qge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiR2V0XCIsIFwiZ2V0IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZvckVhY2hcIiwgXCJmb3JlYWNoIHt4fVwiLCBcImZvciBlYWNoIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkNvdW50XCIsIFwiY291bnRcIiwgXCJjb3VudCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJBbGxcIiwgXCJhbGwge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiQW55XCIsIFwiYW55IHt4fVwiLCBcImFueVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlRha2VXaGlsZVwiLCBcInRha2Ugd2hpbGUge3h9XCIsIFwidGFrZSB7eH0gd2hpbGVcIiwgXCJ0YWtld2hpbGUge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGFrZVwiLCBcInRha2Uge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2tpcFwiLCBcInNraXAge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiTWluXCIsIFwibWluIHt4fVwiLCBcIm1pblwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIk1heFwiLCBcIm1heCB7eH1cIiwgXCJtYXhcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJHcm91cEJ5XCIsIFwiZ3JvdXBieSB7eH1cIiwgXCJncm91cCBieSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJEaXN0aW5jdFwiLCBcImRpc3RpbmN0IHt4fVwiLCBcImRpc3RpbmN0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmluZExhc3RJbmRleFwiLCBcImZpbmRsYXN0aW5kZXgge3h9XCIsIFwiZmluZCBsYXN0IGluZGV4IHt4fVwiLCBcImZpbmRpbmRleCB7eH0gbGFzdFwiLCBcImZpbmQgaW5kZXgge3h9IGxhc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJGaW5kSW5kZXhcIiwgXCJmaW5kZmlyc3RpbmRleCB7eH1cIiwgXCJmaW5kIGZpcnN0IGluZGV4IHt4fVwiLCBcImZpbmRpbmRleCB7eH0gZmlyc3RcIiwgXCJmaW5kIGluZGV4IHt4fSBmaXJzdFwiLCBcImZpbmRpbmRleCB7eH1cIiwgXCJmaW5kIGluZGV4IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIk9yZGVyQnlEZXNjZW5kaW5nXCIsIFwib3JkZXJieSB7eH0gZGVzY2VuZGluZ1wiLCBcIm9yZGVyIGJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwib3JkZXJieSBkZXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyYnlkZXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyIGJ5IGRlc2NlbmRpbmcge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiT3JkZXJCeVwiLCBcIm9yZGVyYnkge3h9IGFzY2VuZGluZ1wiLCBcIm9yZGVyIGJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJvcmRlcmJ5YXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyIGJ5IGFzY2VuZGluZyB7eH1cIiwgXCJvcmRlcmJ5IHt4fVwiLCBcIm9yZGVyIGJ5IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpcnN0T3JEZWZhdWx0XCIsIFwiZmlyc3RvcmRlZmF1bHQge3h9XCIsIFwiZmlyc3Qgb3IgZGVmYXVsdCB7eH1cIiwgXCJmaXJzdG9yZGVmYXVsdFwiLCBcImZpcnN0IG9yIGRlZmF1bHRcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJMYXN0T3JEZWZhdWx0XCIsIFwibGFzdG9yZGVmYXVsdCB7eH1cIiwgXCJsYXN0IG9yIGRlZmF1bHQge3h9XCIsIFwibGFzdG9yZGVmYXVsdFwiLCBcImxhc3Qgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlNpbmdsZU9yRGVmYXVsdFwiLCBcInNpbmdsZW9yZGVmYXVsdCB7eH1cIiwgXCJzaW5nbGUgb3IgZGVmYXVsdCB7eH1cIiwgXCJzaW5nbGVvcmRlZmF1bHRcIiwgXCJzaW5nbGUgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpcnN0XCIsIFwiZmlyc3Qge3h9XCIsIFwiZmlyc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJMYXN0XCIsIFwibGFzdCB7eH1cIiwgXCJsYXN0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2luZ2xlXCIsIFwic2luZ2xlIHt4fVwiLCBcInNpbmdsZVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlRoZW5CeURlc2NlbmRpbmdcIiwgXCJ0aGVuYnkge3h9IGRlc2NlbmRpbmdcIiwgXCJ0aGVuIGJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwidGhlbmJ5ZGVzY2VuZGluZyB7eH1cIiwgXCJ0aGVuIGJ5IGRlc2NlbmRpbmcge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGhlbkJ5XCIsIFwidGhlbmJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJ0aGVuIGJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJ0aGVuYnlhc2NlbmRpbmcge3h9XCIsIFwidGhlbiBieSBhc2NlbmRpbmcge3h9XCIsIFwidGhlbmJ5IHt4fVwiLCBcInRoZW4gYnkge3h9XCIpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBOb25FbnVtZXJhYmxlKG5hbWU6IHN0cmluZywgdmFsdWU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIG5hbWUsIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgXCJfbGlucTRqc19cIiwge1xyXG4gICAgdmFsdWU6IHsgT3JkZXI6IFtdIH0sXHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxyXG59KTsiLCJuYW1lc3BhY2UgTGlucTRKUyB7XHJcbiAgICBleHBvcnQgY2xhc3MgT3JkZXJFbnRyeSB7XHJcbiAgICAgICAgcHVibGljIERpcmVjdGlvbjogT3JkZXJEaXJlY3Rpb247XHJcbiAgICAgICAgcHVibGljIFZhbHVlU2VsZWN0b3I6IChpdGVtOiBhbnkpID0+IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoX2RpcmVjdGlvbjogT3JkZXJEaXJlY3Rpb24sIF92YWx1ZVNlbGVjdG9yOiAoaXRlbTogYW55KSA9PiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5EaXJlY3Rpb24gPSBfZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLlZhbHVlU2VsZWN0b3IgPSBfdmFsdWVTZWxlY3RvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGVudW0gT3JkZXJEaXJlY3Rpb24ge1xyXG4gICAgICAgIEFzY2VuZGluZywgRGVzY2VuZGluZ1xyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIFNlbGVjdEVudHJ5IHtcclxuICAgICAgICBwdWJsaWMgcHJvcGVydHk6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihuOiBzdHJpbmcsIHA6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuO1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5ID0gcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQWRkXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdDogVCwgZ2VuZXJhdGVJZD86IGJvb2xlYW4pOiBUW10ge1xyXG4gICAgaWYgKG9iamVjdCAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGdlbmVyYXRlSWQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgbGV0IG5ld0luZGV4OiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FzdGVkT2JqZWN0OiBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSA9IG9iamVjdCBhcyBhbnk7XHJcbiAgICAgICAgICAgIGxldCBsYXN0OiBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSA9IHRoaXMuV2hlcmUoKHg6IGFueSkgPT4geC5fR2VuZXJhdGVkSWRfICE9IG51bGwpLk9yZGVyQnkoKHg6IGFueSkgPT4geC5fR2VuZXJhdGVkSWRfKS5MYXN0T3JEZWZhdWx0KCkgYXMgYW55O1xyXG4gICAgICAgICAgICBpZiAobGFzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGxhc3QuX0dlbmVyYXRlZElkXyAhPSBudWxsID8gbGFzdC5fR2VuZXJhdGVkSWRfIDogMTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5BbnkoZnVuY3Rpb24oeDogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5fR2VuZXJhdGVkSWRfID09PSBuZXdJbmRleDtcclxuICAgICAgICAgICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXyA9IG5ld0luZGV4O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF8gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnB1c2gob2JqZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkFkZFJhbmdlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdHM6IFRbXSwgZ2VuZXJhdGVJZDogYm9vbGVhbik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICB0aGF0LkFkZCh4LCBnZW5lcmF0ZUlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQWdncmVnYXRlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG1ldGhvZDogKChyZXN1bHQ6IGFueSwgaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZywgc3RhcnRWYWw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgbGV0IHJlc3VsdDogYW55O1xyXG5cclxuICAgIGlmIChzdGFydFZhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc3RhcnRWYWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1ldGhvZEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChyZXN1bHQ6IGFueSwgaXRlbTogVCkgPT4gYW55PihtZXRob2QpO1xyXG5cclxuICAgIHRoaXMuRm9yRWFjaChmdW5jdGlvbih4KXtcclxuICAgICAgICByZXN1bHQgPSBtZXRob2RGdW5jdGlvbihyZXN1bHQsIHgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkFsbFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLkNvdW50KGZpbHRlcikgPT09IHRoaXMuQ291bnQoKTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkFueVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5Db3VudChmaWx0ZXIpID4gMDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkF2ZXJhZ2VcIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGxldCBhcnJheTogYW55W10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJheS5Gb3JFYWNoKGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJlc3VsdCArPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdCAvIGFycmF5LkNvdW50KCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJDbG9uZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdKTogVFtdIHtcclxuICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgb2JqIG9mIHRoaXMpIHtcclxuICAgICAgICBuZXdBcnJheS5BZGQob2JqKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJDb25jYXRcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb25jYXQoYXJyYXkpO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQ29udGFpbnNcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBUKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5BbnkoZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IG9iamVjdDtcclxuICAgIH0pO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQ291bnRcIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5XaGVyZShmaWx0ZXIpLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRGlzdGluY3RcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuV2hlcmUoKHgsIGkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuRmluZEluZGV4KHkgPT4gdmFsdWVTZWxlY3RvckZ1bmN0aW9uKHkpID09PSB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24oeCkpID09PSBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5XaGVyZSgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5GaW5kSW5kZXgoeSA9PiB5ID09PSB4KSA9PT0gaTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkV2YWx1YXRlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGNvbW1hbmQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICBsZXQgY29tbWFuZFBhcnRzOiBzdHJpbmdbXSA9IExpbnE0SlMuSGVscGVyLlNwbGl0Q29tbWFuZChjb21tYW5kKTtcclxuXHJcbiAgICBsZXQgY29tcHV0ZU9iamVjdDogYW55ID0gdGhpcztcclxuXHJcbiAgICBmb3IgKGxldCBjbWQgb2YgY29tbWFuZFBhcnRzKSB7XHJcbiAgICAgICAgbGV0IGNtZFJlc3VsdCA9IExpbnE0SlMuSGVscGVyLk1hdGNoQ29tbWFuZChjbWQpO1xyXG5cclxuICAgICAgICBjb21wdXRlT2JqZWN0ID0gY29tcHV0ZU9iamVjdFtjbWRSZXN1bHQuQ29tbWFuZF0oY21kUmVzdWx0LkR5bmFtaWNGdW5jdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbXB1dGVPYmplY3Q7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJGaW5kSW5kZXhcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYm9vbGVhbj4oZmlsdGVyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBvYmo6IFQgPSB0aGlzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpbHRlckZ1bmN0aW9uKG9iaikgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFlvdSBtdXN0IGRlZmluZSBhIGZpbHRlclwiKTtcclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkZpbmRMYXN0SW5kZXhcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYm9vbGVhbj4oZmlsdGVyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgbGV0IG9iajogVCA9IHRoaXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRnVuY3Rpb24ob2JqKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRmlyc3RcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IFQge1xyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVFtdID0gdGhpcy5XaGVyZShmaWx0ZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBGaXJzdCBFbnRyeSB3YXMgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBGaXJzdCBFbnRyeSB3YXMgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkZpcnN0T3JEZWZhdWx0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJGb3JFYWNoXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFjdGlvbjogKChpdGVtOiBULCBpbmRleD86IG51bWJlcikgPT4gYm9vbGVhbiB8IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IGFjdGlvbkZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBpbmRleD86IG51bWJlcikgPT4gYm9vbGVhbiB8IGFueT4oYWN0aW9uLCB0cnVlKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYWN0aW9uRnVuY3Rpb24odGhpc1tpXSwgaSk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiR2V0XCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIGluZGV4OiBudW1iZXIpOiBUIHtcclxuICAgIHJldHVybiB0aGlzW2luZGV4XTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkdyb3VwQnlcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgc2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXVtdIHtcclxuICAgIGxldCBzZWxlY3RvckZ1bmN0aW9uOiAoaXRlbTogVCkgPT4gYW55ID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXVtdID0gW107XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXMuT3JkZXJCeShzZWxlY3RvckZ1bmN0aW9uKTtcclxuXHJcbiAgICBsZXQgcHJldjogVDtcclxuICAgIGxldCBuZXdTdWI6IFRbXSA9IFtdO1xyXG5cclxuICAgIG9yZGVyZWQuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RvckZ1bmN0aW9uKHByZXYpICE9PSBzZWxlY3RvckZ1bmN0aW9uKHgpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5BZGQobmV3U3ViKTtcclxuICAgICAgICAgICAgICAgIG5ld1N1YiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbmV3U3ViLl9saW5xNGpzXy5Hcm91cFZhbHVlID0gc2VsZWN0b3JGdW5jdGlvbih4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld1N1Yi5fbGlucTRqc18uR3JvdXBWYWx1ZSA9IHNlbGVjdG9yRnVuY3Rpb24oeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdTdWIuQWRkKHgpO1xyXG4gICAgICAgIHByZXYgPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG5ld1N1Yi5Db3VudCgpID4gMCkge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChuZXdTdWIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkluc2VydFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIGluZGV4OiBudW1iZXIpOiBUW10ge1xyXG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDAsIG9iamVjdCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkludGVyc2VjdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgdGhpcy5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgIGlmIChhcnJheS5Db250YWlucyh4KSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5BZGQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXJyYXkuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAodGhhdC5Db250YWlucyh4KSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5BZGQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5LkRpc3RpbmN0KCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJKb2luXCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIGNoYXI6IHN0cmluZywgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IGFycmF5OiBhbnlbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IHRoaXMuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyYXkuam9pbihjaGFyKTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJMYXN0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBUIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkdldChyZXN1bHQubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIExhc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkdldCh0aGlzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBMYXN0IEVudHJ5IHdhcyBub3QgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiTGFzdE9yRGVmYXVsdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUW10gPSB0aGlzLldoZXJlKGZpbHRlcik7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQocmVzdWx0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0KHRoaXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiTWF4XCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGlmICh2YWx1ZVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLk9yZGVyQnkodmFsdWVTZWxlY3RvckZ1bmN0aW9uKS5MYXN0T3JEZWZhdWx0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLk9yZGVyQnkoeCA9PiB4KS5MYXN0T3JEZWZhdWx0KCk7XHJcbiAgICB9XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJNaW5cIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgdmFsdWVTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgaWYgKHZhbHVlU2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLk9yZGVyQnkodmFsdWVTZWxlY3RvckZ1bmN0aW9uKS5GaXJzdE9yRGVmYXVsdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5PcmRlckJ5KHggPT4geCkuRmlyc3RPckRlZmF1bHQoKTtcclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIk1vdmVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV3SW5kZXg6IG51bWJlcik6IFRbXSB7XHJcbiAgICB0aGlzLnNwbGljZShuZXdJbmRleCwgMCwgdGhpcy5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiT3JkZXJCeVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgb3JkZXJlZDogVFtdID0gdGhpcy5DbG9uZSgpO1xyXG4gICAgb3JkZXJlZC5fbGlucTRqc18uT3JkZXIgPSBuZXcgQXJyYXk8TGlucTRKUy5PcmRlckVudHJ5PihuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uQXNjZW5kaW5nLCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pKTtcclxuXHJcbiAgICByZXR1cm4gb3JkZXJlZC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKHZhbHVlU2VsZWN0b3JGdW5jdGlvbiwgYSwgYiwgZmFsc2UpO1xyXG4gICAgfSk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJPcmRlckJ5RGVzY2VuZGluZ1wiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgb3JkZXJlZDogVFtdID0gdGhpcy5DbG9uZSgpO1xyXG4gICAgb3JkZXJlZC5fbGlucTRqc18uT3JkZXIgPSBuZXcgQXJyYXk8TGlucTRKUy5PcmRlckVudHJ5PihuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uRGVzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBMaW5xNEpTLkhlbHBlci5PcmRlckNvbXBhcmVGdW5jdGlvbih2YWx1ZVNlbGVjdG9yRnVuY3Rpb24sIGEsIGIsIHRydWUpO1xyXG4gICAgfSk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJSYW5nZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBzdGFydDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBuZXdBcnJheS5BZGQodGhpcy5HZXQoaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlJlbW92ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgb2JqZWN0IGNhbm5vdCBiZSBudWxsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3IoeCkgPT09IHNlbGVjdG9yKG9iamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5fR2VuZXJhdGVkSWRfID09PSBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXztcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0LklkICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5JZCA9PT0gY2FzdGVkT2JqZWN0LklkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc3BsaWNlKHRhcmdldEluZGV4LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogTm90aGluZyBmb3VuZCB0byBSZW1vdmVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJSZW1vdmVSYW5nZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3RzOiBUW10sIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuUmVtb3ZlKHgsIHNlbGVjdG9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuUmVtb3ZlKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiUmVwZWF0XCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIG9iamVjdDogVCwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLkFkZChvYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiUmV2ZXJzZVwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdKTogVFtdIHtcclxuICAgIHJldHVybiB0aGlzLnJldmVyc2UoKTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNlbGVjdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBzZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogYW55W10ge1xyXG4gICAgbGV0IHNlbGVjdG9yV29yazogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nID0gc2VsZWN0b3I7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvcldvcmsgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBsZXQgc2VsZWN0U3RhdGVtZW50ID0gc2VsZWN0b3JXb3JrLnN1YnN0cihzZWxlY3RvcldvcmsuaW5kZXhPZihcIj0+XCIpICsgKFwiPT5cIikubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdFN0YXRlbWVudC5tYXRjaCgvXlxccyp7Lip9XFxzKiQvKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdFN0YXRlbWVudCA9IHNlbGVjdFN0YXRlbWVudC5yZXBsYWNlKC9eXFxzKnsoLiopfVxccyokLywgXCIkMVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IHNlbGVjdFN0YXRlbWVudC5zcGxpdCgvLCg/PSg/OlteJ1wiXSpbJ1wiXVteJ1wiXSpbJ1wiXSkqW14nXCJdKiQpL2cpO1xyXG4gICAgICAgICAgICBsZXQgbmV3Q29udGVudCA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0LmluZGV4T2YoXCI6XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gcGFydDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdDb250ZW50ICs9IHBhcnQucmVwbGFjZShcIj1cIiwgXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gcGFydC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gbmFtZSArIFwiOlwiICsgcGFydDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHBhcnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdDb250ZW50ICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RvcldvcmsgPSBzZWxlY3Rvcldvcmsuc3Vic3RyKDAsIHNlbGVjdG9yV29yay5pbmRleE9mKFwiPT5cIikpICsgXCI9PiByZXR1cm4ge1wiICsgbmV3Q29udGVudCArIFwifVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihzZWxlY3RvcldvcmssIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IGFueVtdID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgZm9yIChsZXQgb2JqIG9mIHRoaXMpIHtcclxuICAgICAgICBuZXdBcnJheS5BZGQoc2VsZWN0b3JGdW5jdGlvbihvYmopKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTZWxlY3RNYW55XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBhbnlbXSB7XHJcbiAgICBsZXQgbmV3QXJyYXk6IGFueVtdID0gbmV3IEFycmF5KCk7XHJcbiAgICBsZXQgc2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihzZWxlY3Rvcik7XHJcblxyXG4gICAgdGhpcy5Gb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW1zID0gc2VsZWN0b3JGdW5jdGlvbihpdGVtKSB8fCBbXTtcclxuICAgICAgICBuZXdBcnJheS5BZGRSYW5nZShpdGVtcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTZXF1ZW5jZUVxdWFsXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFycmF5OiBUW10pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLkNvdW50KCkgIT09IGFycmF5LkNvdW50KCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzW2ldKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpe1xyXG4gICAgICAgICAgICBpZiAoKHRoaXNbaV0gYXMgYW55KVtrZXldICE9PSAoYXJyYXlbaV0gYXMgYW55KVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTaW5nbGVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVFtdID0gdGhpcy5XaGVyZShmaWx0ZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LkNvdW50KCkgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIGFycmF5IGRvZXMgbm90IGNvbnRhaW4gZXhhY3RseSBvbmUgZWxlbWVudFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLkNvdW50KCkgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBhcnJheSBkb2VzIG5vdCBjb250YWluIGV4YWN0bHkgb25lIGVsZW1lbnRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiU2luZ2xlT3JEZWZhdWx0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5Db3VudCgpID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuQ291bnQoKSA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBhcnJheSBjb250YWlucyBtb3JlIHRoYW4gb25lIGVsZW1lbnRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuQ291bnQoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5HZXQoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuQ291bnQoKSA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBhcnJheSBjb250YWlucyBtb3JlIHRoYW4gb25lIGVsZW1lbnRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNraXBcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5zbGljZShjb3VudCwgdGhpcy5Db3VudCgpKTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlN1bVwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBzZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZywgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSAwO1xyXG4gICAgbGV0IGFycmF5OiBhbnlbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgYXJyYXkgPSBhcnJheS5XaGVyZShmaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgYXJyYXkgPSBhcnJheS5TZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmF5LkZvckVhY2goZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmVzdWx0ICs9IHg7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiVGFrZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBjb3VudDogbnVtYmVyKTogVFtdIHtcclxuICAgIHJldHVybiB0aGlzLnNsaWNlKDAsIGNvdW50KTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlRha2VXaGlsZVwiLCBmdW5jdGlvbjxUPiAoXHJcbiAgICB0aGlzOiBUW10sXHJcbiAgICBjb25kaXRpb246ICgoaXRlbTogVCwgc3RvcmFnZT86IGFueSkgPT4gYm9vbGVhbikgfCBzdHJpbmcsXHJcbiAgICBpbml0aWFsPzogKChzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgc3RyaW5nLFxyXG4gICAgYWZ0ZXI/OiAoKGl0ZW06IFQsIHN0b3JhZ2U6IGFueSkgPT4gdm9pZCkgfCBzdHJpbmcpOiBUW10ge1xyXG5cclxuICAgIGxldCBjb25kaXRpb25GdW5jdGlvbjogKGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4gPVxyXG4gICAgICAgIExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgc3RvcmFnZT86IGFueSkgPT4gYm9vbGVhbj4oY29uZGl0aW9uKTtcclxuXHJcbiAgICBsZXQgc3RvcmFnZTogYW55ID0ge307XHJcblxyXG4gICAgaWYgKGluaXRpYWwgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBpbml0aWFsRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KHN0b3JhZ2U6IGFueSkgPT4gdm9pZD4oaW5pdGlhbCk7XHJcbiAgICAgICAgaW5pdGlhbEZ1bmN0aW9uKHN0b3JhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBhZnRlckZ1bmN0aW9uOiAoKGl0ZW06IFQsIHN0b3JhZ2U6IGFueSkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBpZiAoYWZ0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGFmdGVyRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQsIHN0b3JhZ2U6IGFueSkgPT4gdm9pZD4oYWZ0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IG9iamVjdCBvZiB0aGlzKXtcclxuICAgICAgICBpZiAoY29uZGl0aW9uRnVuY3Rpb24ob2JqZWN0LCBzdG9yYWdlKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXN1bHQuQWRkKG9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWZ0ZXJGdW5jdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhZnRlckZ1bmN0aW9uKG9iamVjdCwgc3RvcmFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlRoZW5CeVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy5fbGlucTRqc18uT3JkZXIgPT0gbnVsbCB8fCB0aGlzLl9saW5xNGpzXy5PcmRlci5Db3VudCgpID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogUGxlYXNlIGNhbGwgT3JkZXJCeSBvciBPcmRlckJ5RGVzY2VuZGluZyBiZWZvcmUgVGhlbkJ5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGlzO1xyXG4gICAgb3JkZXJlZC5fbGlucTRqc18uT3JkZXIuQWRkKG5ldyBMaW5xNEpTLk9yZGVyRW50cnkoTGlucTRKUy5PcmRlckRpcmVjdGlvbi5Bc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygb3JkZXJlZC5fbGlucTRqc18uT3JkZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24oZW50cnkuVmFsdWVTZWxlY3RvciwgYSwgYiwgZW50cnkuRGlyZWN0aW9uID09PSBMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlRoZW5CeURlc2NlbmRpbmdcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuX2xpbnE0anNfLk9yZGVyID09IG51bGwgfHwgdGhpcy5fbGlucTRqc18uT3JkZXIuQ291bnQoKSA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFBsZWFzZSBjYWxsIE9yZGVyQnkgb3IgT3JkZXJCeURlc2NlbmRpbmcgYmVmb3JlIFRoZW5CeURlc2NlbmRpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXM7XHJcbiAgICBvcmRlcmVkLl9saW5xNGpzXy5PcmRlci5BZGQobmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygb3JkZXJlZC5fbGlucTRqc18uT3JkZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24oZW50cnkuVmFsdWVTZWxlY3RvciwgYSwgYiwgZW50cnkuRGlyZWN0aW9uID09PSBMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlRvRGljdGlvbmFyeVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBrZXlTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nLCB2YWx1ZVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogYW55IHtcclxuICAgIGxldCBrZXlTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KGtleVNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgcmV0dXJuT2JqZWN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICByZXR1cm5PYmplY3Rba2V5U2VsZWN0b3JGdW5jdGlvbih4KV0gPSB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24oeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuT2JqZWN0W2tleVNlbGVjdG9yRnVuY3Rpb24oeCldID0geDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmV0dXJuT2JqZWN0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiVW5pb25cIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5Db25jYXQoYXJyYXkpLkRpc3RpbmN0KCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJVcGRhdGVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBwcmltYXJ5S2V5U2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRhcmdldEluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIG9iamVjdCBjYW5ub3QgYmUgbnVsbFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2FzdGVkT2JqZWN0OiBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSA9IG9iamVjdCBhcyBhbnk7XHJcblxyXG4gICAgaWYgKHByaW1hcnlLZXlTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHByaW1hcnlLZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yKHgpID09PSBzZWxlY3RvcihvYmplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXyAhPSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuX0dlbmVyYXRlZElkXyA9PT0gY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF87XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5JZCAhPSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuSWQgPT09IGNhc3RlZE9iamVjdC5JZDtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4geCA9PT0gb2JqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBsZXQga2V5czogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhvYmplY3QpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSBcIklkXCIpIHtcclxuICAgICAgICAgICAgICAgICh0aGlzW3RhcmdldEluZGV4XSBhcyBhbnkpW2tleV0gPSAob2JqZWN0IGFzIGFueSlba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogTm90aGluZyBmb3VuZCB0byBVcGRhdGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJVcGRhdGVSYW5nZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3RzOiBUW10sIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuVXBkYXRlKHgsIHNlbGVjdG9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuVXBkYXRlKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiV2hlcmVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQsIGluZGV4PzogbnVtYmVyKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgZmlsdGVyRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQsIGluZGV4PzogbnVtYmVyKSA9PiBib29sZWFuPihmaWx0ZXIpO1xyXG5cclxuICAgICAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG9iajogVCA9IHRoaXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRnVuY3Rpb24ob2JqLCBpKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXkucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFlvdSBtdXN0IGRlZmluZSBhIGZpbHRlclwiKTtcclxuICAgIH1cclxuXHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJaaXBcIiwgZnVuY3Rpb248VCwgWD4gKHRoaXM6IFRbXSwgYXJyYXk6IFhbXSwgcmVzdWx0OiAoKGZpcnN0OiBULCBzZWNvbmQ6IFgpID0+IGFueSkgfCBzdHJpbmcpOiBhbnlbXSB7XHJcbiAgICBsZXQgcmVzdWx0RnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGZpcnN0OiBULCBzZWNvbmQ6IFgpID0+IGFueT4ocmVzdWx0KTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXkgPSBuZXcgQXJyYXk8YW55PigpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChhcnJheVtpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG5ld0FycmF5LkFkZChyZXN1bHRGdW5jdGlvbih0aGlzW2ldLCBhcnJheVtpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn0pOyJdfQ==
