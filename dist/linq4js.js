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
        Helper.CreateArrayData = function (array, value) {
            if (value === void 0) { value = {}; }
            Object.defineProperty(array, "_linq4js_", {
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
            if (filterFunction(obj)) {
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
    var result = this;
    if (filter != null) {
        result = this.Where(filter);
    }
    if (result.Any()) {
        return result.Get(0);
    }
    else {
        throw new Error("Linq4JS: The First Entry was not found");
    }
});
Linq4JS.Helper.NonEnumerable("FirstOrDefault", function (filter) {
    var result = this;
    if (filter != null) {
        result = this.Where(filter);
    }
    if (result.Any()) {
        return result.Get(0);
    }
    else {
        return null;
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
                Linq4JS.Helper.CreateArrayData(newSub, {});
                newSub._linq4js_.GroupValue = selectorFunction(x);
            }
        }
        else {
            Linq4JS.Helper.CreateArrayData(newSub, {});
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
    var result = this;
    if (filter != null) {
        result = this.Where(filter);
    }
    if (result.Any()) {
        return result.Get(result.length - 1);
    }
    else {
        throw new Error("Linq4JS: The Last Entry was not found");
    }
});
Linq4JS.Helper.NonEnumerable("LastOrDefault", function (filter) {
    var result = this;
    if (filter != null) {
        result = this.Where(filter);
    }
    if (result.Any()) {
        return result.Get(result.length - 1);
    }
    else {
        return null;
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
    Linq4JS.Helper.CreateArrayData(ordered, {});
    ordered._linq4js_.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, false);
    });
});
Linq4JS.Helper.NonEnumerable("OrderByDescending", function (valueSelector) {
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = this.Clone();
    Linq4JS.Helper.CreateArrayData(ordered, {});
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
    return this.Clone().reverse();
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
    var newArray = [];
    if (this._linq4js_ && this._linq4js_.GroupValue) {
        newArray._linq4js_ = { GroupValue: this._linq4js_.GroupValue, Order: [] };
    }
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var obj = _a[_i];
        newArray.Add(selectorFunction(obj));
    }
    return newArray;
});
Linq4JS.Helper.NonEnumerable("SelectMany", function (selector) {
    var newArray = [];
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
    var result = this;
    if (filter != null) {
        result = this.Where(filter);
    }
    if (result.Count() === 1) {
        return result.Get(0);
    }
    else {
        throw new Error("Linq4JS: The array does not contain exactly one element");
    }
});
Linq4JS.Helper.NonEnumerable("SingleOrDefault", function (filter) {
    var result = this;
    if (filter != null) {
        result = this.Where(filter);
    }
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
    if (this._linq4js_ == null || this._linq4js_.Order == null || this._linq4js_.Order.Count() === 0) {
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
    if (this._linq4js_ == null || this._linq4js_.Order == null || this._linq4js_.Order.Count() === 0) {
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
    var newArray = [];
    for (var i = 0; i < this.length; i++) {
        if (array[i] != null) {
            newArray.Add(resultFunction(this[i], array[i]));
        }
    }
    return newArray;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi9FbnRpdHkudHMiLCJkZXYvRXZhbHVhdGVDb21tYW5kLnRzIiwiZGV2L0hlbHBlci50cyIsImRldi9PcmRlckVudHJ5LnRzIiwiZGV2L1NlbGVjdEVudHJ5LnRzIiwiZGV2L01vZHVsZXMvQWRkLnRzIiwiZGV2L01vZHVsZXMvQWRkUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9BZ2dyZWdhdGUudHMiLCJkZXYvTW9kdWxlcy9BbGwudHMiLCJkZXYvTW9kdWxlcy9BbnkudHMiLCJkZXYvTW9kdWxlcy9BdmVyYWdlLnRzIiwiZGV2L01vZHVsZXMvQ2xvbmUudHMiLCJkZXYvTW9kdWxlcy9Db25jYXQudHMiLCJkZXYvTW9kdWxlcy9Db250YWlucy50cyIsImRldi9Nb2R1bGVzL0NvdW50LnRzIiwiZGV2L01vZHVsZXMvRGlzdGluY3QudHMiLCJkZXYvTW9kdWxlcy9FdmFsdWF0ZS50cyIsImRldi9Nb2R1bGVzL0ZpbmRJbmRleC50cyIsImRldi9Nb2R1bGVzL0ZpbmRMYXN0SW5kZXgudHMiLCJkZXYvTW9kdWxlcy9GaXJzdC50cyIsImRldi9Nb2R1bGVzL0ZpcnN0T3JEZWZhdWx0LnRzIiwiZGV2L01vZHVsZXMvRm9yRWFjaC50cyIsImRldi9Nb2R1bGVzL0dldC50cyIsImRldi9Nb2R1bGVzL0dyb3VwQnkudHMiLCJkZXYvTW9kdWxlcy9JbnNlcnQudHMiLCJkZXYvTW9kdWxlcy9JbnRlcnNlY3QudHMiLCJkZXYvTW9kdWxlcy9Kb2luLnRzIiwiZGV2L01vZHVsZXMvTGFzdC50cyIsImRldi9Nb2R1bGVzL0xhc3RPckRlZmF1bHQudHMiLCJkZXYvTW9kdWxlcy9NYXgudHMiLCJkZXYvTW9kdWxlcy9NaW4udHMiLCJkZXYvTW9kdWxlcy9Nb3ZlLnRzIiwiZGV2L01vZHVsZXMvT3JkZXJCeS50cyIsImRldi9Nb2R1bGVzL09yZGVyQnlEZXNjZW5kaW5nLnRzIiwiZGV2L01vZHVsZXMvUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9SZW1vdmUudHMiLCJkZXYvTW9kdWxlcy9SZW1vdmVSYW5nZS50cyIsImRldi9Nb2R1bGVzL1JlcGVhdC50cyIsImRldi9Nb2R1bGVzL1JldmVyc2UudHMiLCJkZXYvTW9kdWxlcy9TZWxlY3QudHMiLCJkZXYvTW9kdWxlcy9TZWxlY3RNYW55LnRzIiwiZGV2L01vZHVsZXMvU2VxdWVuY2VFcXVhbC50cyIsImRldi9Nb2R1bGVzL1NpbmdsZS50cyIsImRldi9Nb2R1bGVzL1NpbmdsZU9yRGVmYXVsdC50cyIsImRldi9Nb2R1bGVzL1NraXAudHMiLCJkZXYvTW9kdWxlcy9TdW0udHMiLCJkZXYvTW9kdWxlcy9UYWtlLnRzIiwiZGV2L01vZHVsZXMvVGFrZVdoaWxlLnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5LnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1RvRGljdGlvbmFyeS50cyIsImRldi9Nb2R1bGVzL1VuaW9uLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9XaGVyZS50cyIsImRldi9Nb2R1bGVzL1ppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxPQUFPLENBS2hCO0FBTEQsV0FBVSxPQUFPO0lBQ2I7UUFBQTtRQUdBLENBQUM7UUFBRCxzQkFBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksdUJBQWUsa0JBRzNCLENBQUE7QUFDTCxDQUFDLEVBTFMsT0FBTyxLQUFQLE9BQU8sUUFLaEI7QUNMRCxJQUFVLE9BQU8sQ0F5Q2hCO0FBekNELFdBQVUsT0FBTztJQUNiO1FBS0kseUJBQVksT0FBZTtZQUFFLG9CQUF1QjtpQkFBdkIsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO2dCQUF2QixtQ0FBdUI7O1lBSDdDLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFDMUIsV0FBTSxHQUFhLEVBQUUsQ0FBQztZQUd6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixL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ImZpbGUiOiJsaW5xNGpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIEdlbmVyYXRlZEVudGl0eSB7XHJcbiAgICAgICAgcHVibGljIF9HZW5lcmF0ZWRJZF86IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgSWQ6IG51bWJlcjtcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBFdmFsdWF0ZUNvbW1hbmQge1xyXG4gICAgICAgIHB1YmxpYyBDb21tYW5kOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIFNwbGl0UmVnZXg6IFJlZ0V4cFtdID0gW107XHJcbiAgICAgICAgcHVibGljIEZpbmRlcjogUmVnRXhwW10gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29tbWFuZDogc3RyaW5nLCAuLi5pZGVudGlmaWVyOiBzdHJpbmdbXSkge1xyXG4gICAgICAgICAgICB0aGlzLkNvbW1hbmQgPSBjb21tYW5kO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaWQgb2YgaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNTcGxpdFJlZ2V4OiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICBsZXQgc0ZpbmRlcjogc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZC5pbmRleE9mKFwie3h9XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmRleE9mKFwie3h9XCIpID09PSBpZC5sZW5ndGggLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNTcGxpdFJlZ2V4ID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH1cIiwgXCJcIikgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNGaW5kZXIgPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fVwiLCBcIlxcXFxiICguKilcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1NwbGl0UmVnZXggPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fVwiLCBcIlxcXFxiIC4qPyBcXFxcYlwiKSArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc0ZpbmRlciA9IFwiXFxcXGJcIiArIGlkLnJlcGxhY2UoXCIge3h9IFwiLCBcIlxcXFxiICguKikgXFxcXGJcIikgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzU3BsaXRSZWdleCA9IFwiXFxcXGJcIiArIGlkICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHNGaW5kZXIgPSBcIlxcXFxiXCIgKyBpZCArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLkZpbmRlci5wdXNoKG5ldyBSZWdFeHAoc0ZpbmRlciwgXCJpXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuU3BsaXRSZWdleC5wdXNoKG5ldyBSZWdFeHAoc1NwbGl0UmVnZXgsIFwiZ2lcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmFsdWF0ZUNvbW1hbmRSZXN1bHQge1xyXG4gICAgICAgIHB1YmxpYyBDb21tYW5kOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIER5bmFtaWNGdW5jdGlvbjogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjbWQ6IHN0cmluZywgZm46IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLkNvbW1hbmQgPSBjbWQ7XHJcbiAgICAgICAgICAgIHRoaXMuRHluYW1pY0Z1bmN0aW9uID0gZm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgQ29udmVydFN0cmluZ0Z1bmN0aW9uKGZ1bmN0aW9uU3RyaW5nOiBzdHJpbmcsIG5vQXV0b1JldHVybj86IGJvb2xlYW4sIG5vQnJhY2tldFJlcGxhY2U/OiBib29sZWFuKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKGZ1bmN0aW9uU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogQ2Fubm90IGNvbnZlcnQgZW1wdHkgc3RyaW5nIHRvIGZ1bmN0aW9uXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFybmFtZVN0cmluZzogc3RyaW5nID0gZnVuY3Rpb25TdHJpbmdcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMCwgZnVuY3Rpb25TdHJpbmcuaW5kZXhPZihcIj0+XCIpKVxyXG4gICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpXHJcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCIoXCIpLmpvaW4oXCJcIilcclxuICAgICAgICAgICAgICAgIC5zcGxpdChcIilcIikuam9pbihcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YXJuYW1lczogc3RyaW5nW10gPSB2YXJuYW1lU3RyaW5nLnNwbGl0KFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBmdW5jOiBzdHJpbmcgPSBmdW5jdGlvblN0cmluZ1xyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZyhmdW5jdGlvblN0cmluZy5pbmRleE9mKFwiPT5cIikgKyAoXCI9PlwiKS5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vQnJhY2tldFJlcGxhY2UgPT0gbnVsbCB8fCBub0JyYWNrZXRSZXBsYWNlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgZnVuYy5yZXBsYWNlKFwie1wiLCBcIlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuYy5zcGxpdChcIi5tYXRjaCgvL2dpKVwiKS5qb2luKFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vQXV0b1JldHVybiA9PSBudWxsIHx8IG5vQXV0b1JldHVybiA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIC8qTm8gcmV0dXJuIG91dHNpZGUgb2YgcXVvdGF0aW9ucyovXHJcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5tYXRjaCgvcmV0dXJuKD89KFteXFxcIiddKltcXFwiJ11bXlxcXCInXSpbXFxcIiddKSpbXlxcXCInXSokKS9nKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYyA9IFwicmV0dXJuIFwiICsgZnVuYztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKC4uLnZhcm5hbWVzLCBmdW5jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ29udmVydEZ1bmN0aW9uPFQ+KHRlc3RGdW5jdGlvbjogc3RyaW5nIHwgVCwgbm9BdXRvUmV0dXJuPzogYm9vbGVhbiwgbm9CcmFja2V0UmVwbGFjZT86IGJvb2xlYW4pOiBUIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogVDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGVzdEZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRlc3RGdW5jdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVzdEZ1bmN0aW9uID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0U3RyaW5nRnVuY3Rpb24odGVzdEZ1bmN0aW9uLCBub0F1dG9SZXR1cm4sIG5vQnJhY2tldFJlcGxhY2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMaW5xNEpTOiBDYW5ub3QgdXNlICcke3Rlc3RGdW5jdGlvbn0nIGFzIGZ1bmN0aW9uYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIE9yZGVyQ29tcGFyZUZ1bmN0aW9uPFQ+KHZhbHVlU2VsZWN0b3I6IChpdGVtOiBUKSA9PiBhbnksIGE6IFQsIGI6IFQsIGludmVydDogYm9vbGVhbik6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZV9hOiBhbnkgPSB2YWx1ZVNlbGVjdG9yKGEpO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVfYjogYW55ID0gdmFsdWVTZWxlY3RvcihiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0eXBlX2E6IHN0cmluZyA9IHR5cGVvZiB2YWx1ZV9hO1xyXG4gICAgICAgICAgICBsZXQgdHlwZV9iOiBzdHJpbmcgPSB0eXBlb2YgdmFsdWVfYjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlX2EgPT09IFwic3RyaW5nXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9hX3N0cmluZzogc3RyaW5nID0gdmFsdWVfYTtcclxuICAgICAgICAgICAgICAgIHZhbHVlX2Ffc3RyaW5nID0gdmFsdWVfYV9zdHJpbmcudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9iX3N0cmluZzogc3RyaW5nID0gdmFsdWVfYjtcclxuICAgICAgICAgICAgICAgIHZhbHVlX2Jfc3RyaW5nID0gdmFsdWVfYl9zdHJpbmcudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVfYV9zdHJpbmcgPiB2YWx1ZV9iX3N0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPT09IHRydWUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlX2Ffc3RyaW5nIDwgdmFsdWVfYl9zdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID09PSB0cnVlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9hID09PSBcIm51bWJlclwiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYV9udW1iZXI6IG51bWJlciA9IHZhbHVlX2E7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYl9udW1iZXI6IG51bWJlciA9IHZhbHVlX2I7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA9PT0gdHJ1ZSA/IHZhbHVlX2JfbnVtYmVyIC0gdmFsdWVfYV9udW1iZXIgOiB2YWx1ZV9hX251bWJlciAtIHZhbHVlX2JfbnVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYSA9PT0gXCJib29sZWFuXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9hX2Jvb2w6IGJvb2xlYW4gPSB2YWx1ZV9hO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2JfYm9vbDogYm9vbGVhbiA9IHZhbHVlX2I7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlX2FfYm9vbCA9PT0gdmFsdWVfYl9ib29sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZlcnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlX2FfYm9vbCA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVfYV9ib29sID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlX2EgPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9hID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9iID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTcGxpdENvbW1hbmQoY29tbWFuZDogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgc3BsaXRJbmRleGVzOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY21kIG9mIHRoaXMuQ29tbWFuZHMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNwbGl0IG9mIGNtZC5TcGxpdFJlZ2V4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHNwbGl0LmV4ZWMoY29tbWFuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXRJbmRleGVzLnB1c2gocmVzdWx0LmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFydHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgICAgICBzcGxpdEluZGV4ZXMgPSBzcGxpdEluZGV4ZXMuRGlzdGluY3QoKS5PcmRlckJ5KHggPT4geCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0SW5kZXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNwbGl0SW5kZXhlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChjb21tYW5kLnN1YnN0cihzcGxpdEluZGV4ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChjb21tYW5kLnN1YnN0cihzcGxpdEluZGV4ZXNbaV0sIHNwbGl0SW5kZXhlc1tpICsgMV0gLSBzcGxpdEluZGV4ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBNYXRjaENvbW1hbmQoY21kOiBzdHJpbmcpOiBFdmFsdWF0ZUNvbW1hbmRSZXN1bHQge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY29tbWFuZCBvZiB0aGlzLkNvbW1hbmRzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcmVnZXggb2YgY29tbWFuZC5GaW5kZXIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBjbWQubWF0Y2gocmVnZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFdmFsdWF0ZUNvbW1hbmRSZXN1bHQoY29tbWFuZC5Db21tYW5kLCByZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTGlucTRKUzogTm8gbWF0Y2hpbmcgY29tbWFuZCB3YXMgZm91bmQgZm9yICcke2NtZH0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENvbW1hbmRzOiBFdmFsdWF0ZUNvbW1hbmRbXSA9IFtcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkNsb25lXCIsIFwiY2xvbmVcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJSZXZlcnNlXCIsIFwicmV2ZXJzZVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkNvbnRhaW5zXCIsIFwiY29udGFpbnMge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiSm9pblwiLCBcImpvaW4ge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU3VtXCIsIFwic3VtIHt4fVwiLCBcInN1bVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkF2ZXJhZ2VcIiwgXCJhdmVyYWdlIHt4fVwiLCBcImF2ZXJhZ2VcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJXaGVyZVwiLCBcIndoZXJlIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlNlbGVjdE1hbnlcIiwgXCJzZWxlY3RtYW55IHt4fVwiLCBcInNlbGVjdCBtYW55IHt4fVwiLCBcInNlbGVjdCB7eH0gbWFueVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlNlbGVjdFwiLCBcInNlbGVjdCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJHZXRcIiwgXCJnZXQge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRm9yRWFjaFwiLCBcImZvcmVhY2gge3h9XCIsIFwiZm9yIGVhY2gge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiQ291bnRcIiwgXCJjb3VudFwiLCBcImNvdW50IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkFsbFwiLCBcImFsbCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJBbnlcIiwgXCJhbnkge3h9XCIsIFwiYW55XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGFrZVdoaWxlXCIsIFwidGFrZSB3aGlsZSB7eH1cIiwgXCJ0YWtlIHt4fSB3aGlsZVwiLCBcInRha2V3aGlsZSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJUYWtlXCIsIFwidGFrZSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTa2lwXCIsIFwic2tpcCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJNaW5cIiwgXCJtaW4ge3h9XCIsIFwibWluXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiTWF4XCIsIFwibWF4IHt4fVwiLCBcIm1heFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkdyb3VwQnlcIiwgXCJncm91cGJ5IHt4fVwiLCBcImdyb3VwIGJ5IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkRpc3RpbmN0XCIsIFwiZGlzdGluY3Qge3h9XCIsIFwiZGlzdGluY3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJGaW5kTGFzdEluZGV4XCIsIFwiZmluZGxhc3RpbmRleCB7eH1cIiwgXCJmaW5kIGxhc3QgaW5kZXgge3h9XCIsIFwiZmluZGluZGV4IHt4fSBsYXN0XCIsIFwiZmluZCBpbmRleCB7eH0gbGFzdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpbmRJbmRleFwiLCBcImZpbmRmaXJzdGluZGV4IHt4fVwiLCBcImZpbmQgZmlyc3QgaW5kZXgge3h9XCIsIFwiZmluZGluZGV4IHt4fSBmaXJzdFwiLCBcImZpbmQgaW5kZXgge3h9IGZpcnN0XCIsIFwiZmluZGluZGV4IHt4fVwiLCBcImZpbmQgaW5kZXgge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiT3JkZXJCeURlc2NlbmRpbmdcIiwgXCJvcmRlcmJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwib3JkZXIgYnkge3h9IGRlc2NlbmRpbmdcIiwgXCJvcmRlcmJ5IGRlc2NlbmRpbmcge3h9XCIsIFwib3JkZXJieWRlc2NlbmRpbmcge3h9XCIsIFwib3JkZXIgYnkgZGVzY2VuZGluZyB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJPcmRlckJ5XCIsIFwib3JkZXJieSB7eH0gYXNjZW5kaW5nXCIsIFwib3JkZXIgYnkge3h9IGFzY2VuZGluZ1wiLCBcIm9yZGVyYnlhc2NlbmRpbmcge3h9XCIsIFwib3JkZXIgYnkgYXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyYnkge3h9XCIsIFwib3JkZXIgYnkge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmlyc3RPckRlZmF1bHRcIiwgXCJmaXJzdG9yZGVmYXVsdCB7eH1cIiwgXCJmaXJzdCBvciBkZWZhdWx0IHt4fVwiLCBcImZpcnN0b3JkZWZhdWx0XCIsIFwiZmlyc3Qgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkxhc3RPckRlZmF1bHRcIiwgXCJsYXN0b3JkZWZhdWx0IHt4fVwiLCBcImxhc3Qgb3IgZGVmYXVsdCB7eH1cIiwgXCJsYXN0b3JkZWZhdWx0XCIsIFwibGFzdCBvciBkZWZhdWx0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2luZ2xlT3JEZWZhdWx0XCIsIFwic2luZ2xlb3JkZWZhdWx0IHt4fVwiLCBcInNpbmdsZSBvciBkZWZhdWx0IHt4fVwiLCBcInNpbmdsZW9yZGVmYXVsdFwiLCBcInNpbmdsZSBvciBkZWZhdWx0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmlyc3RcIiwgXCJmaXJzdCB7eH1cIiwgXCJmaXJzdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkxhc3RcIiwgXCJsYXN0IHt4fVwiLCBcImxhc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTaW5nbGVcIiwgXCJzaW5nbGUge3h9XCIsIFwic2luZ2xlXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGhlbkJ5RGVzY2VuZGluZ1wiLCBcInRoZW5ieSB7eH0gZGVzY2VuZGluZ1wiLCBcInRoZW4gYnkge3h9IGRlc2NlbmRpbmdcIiwgXCJ0aGVuYnlkZXNjZW5kaW5nIHt4fVwiLCBcInRoZW4gYnkgZGVzY2VuZGluZyB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJUaGVuQnlcIiwgXCJ0aGVuYnkge3h9IGFzY2VuZGluZ1wiLCBcInRoZW4gYnkge3h9IGFzY2VuZGluZ1wiLCBcInRoZW5ieWFzY2VuZGluZyB7eH1cIiwgXCJ0aGVuIGJ5IGFzY2VuZGluZyB7eH1cIiwgXCJ0aGVuYnkge3h9XCIsIFwidGhlbiBieSB7eH1cIilcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIE5vbkVudW1lcmFibGUobmFtZTogc3RyaW5nLCB2YWx1ZTogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENyZWF0ZUFycmF5RGF0YShhcnJheTogYW55W10sIHZhbHVlOiBhbnkgPSB7fSkge1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYXJyYXksIFwiX2xpbnE0anNfXCIsIHtcclxuICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIE9yZGVyRW50cnkge1xyXG4gICAgICAgIHB1YmxpYyBEaXJlY3Rpb246IE9yZGVyRGlyZWN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWYWx1ZVNlbGVjdG9yOiAoaXRlbTogYW55KSA9PiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKF9kaXJlY3Rpb246IE9yZGVyRGlyZWN0aW9uLCBfdmFsdWVTZWxlY3RvcjogKGl0ZW06IGFueSkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuRGlyZWN0aW9uID0gX2RpcmVjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5WYWx1ZVNlbGVjdG9yID0gX3ZhbHVlU2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBlbnVtIE9yZGVyRGlyZWN0aW9uIHtcclxuICAgICAgICBBc2NlbmRpbmcsIERlc2NlbmRpbmdcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RFbnRyeSB7XHJcbiAgICAgICAgcHVibGljIHByb3BlcnR5OiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Iobjogc3RyaW5nLCBwOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gbjtcclxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkFkZFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIGdlbmVyYXRlSWQ/OiBib29sZWFuKTogVFtdIHtcclxuICAgIGlmIChvYmplY3QgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChnZW5lcmF0ZUlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdJbmRleDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhc3RlZE9iamVjdDogTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkgPSBvYmplY3QgYXMgYW55O1xyXG4gICAgICAgICAgICBsZXQgbGFzdDogTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkgPSB0aGlzLldoZXJlKCh4OiBhbnkpID0+IHguX0dlbmVyYXRlZElkXyAhPSBudWxsKS5PcmRlckJ5KCh4OiBhbnkpID0+IHguX0dlbmVyYXRlZElkXykuTGFzdE9yRGVmYXVsdCgpIGFzIGFueTtcclxuICAgICAgICAgICAgaWYgKGxhc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBsYXN0Ll9HZW5lcmF0ZWRJZF8gIT0gbnVsbCA/IGxhc3QuX0dlbmVyYXRlZElkXyA6IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuQW55KGZ1bmN0aW9uKHg6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuX0dlbmVyYXRlZElkXyA9PT0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0luZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF8gPSBuZXdJbmRleDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wdXNoKG9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJBZGRSYW5nZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3RzOiBUW10sIGdlbmVyYXRlSWQ6IGJvb2xlYW4pOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgdGhhdC5BZGQoeCwgZ2VuZXJhdGVJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkFnZ3JlZ2F0ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBtZXRob2Q6ICgocmVzdWx0OiBhbnksIGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIHN0YXJ0VmFsPzogYW55KTogc3RyaW5nIHtcclxuICAgIGxldCByZXN1bHQ6IGFueTtcclxuXHJcbiAgICBpZiAoc3RhcnRWYWwgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHN0YXJ0VmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtZXRob2RGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwocmVzdWx0OiBhbnksIGl0ZW06IFQpID0+IGFueT4obWV0aG9kKTtcclxuXHJcbiAgICB0aGlzLkZvckVhY2goZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmVzdWx0ID0gbWV0aG9kRnVuY3Rpb24ocmVzdWx0LCB4KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJBbGxcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5Db3VudChmaWx0ZXIpID09PSB0aGlzLkNvdW50KCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJBbnlcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuQ291bnQoZmlsdGVyKSA+IDA7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJBdmVyYWdlXCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIHNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGxldCByZXN1bHQ6IG51bWJlciA9IDA7XHJcbiAgICBsZXQgYXJyYXk6IGFueVtdID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IGFycmF5LldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IGFycmF5LlNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgYXJyYXkuRm9yRWFjaChmdW5jdGlvbih4KXtcclxuICAgICAgICByZXN1bHQgKz0geDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQgLyBhcnJheS5Db3VudCgpO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQ2xvbmVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IG9iaiBvZiB0aGlzKSB7XHJcbiAgICAgICAgbmV3QXJyYXkuQWRkKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQ29uY2F0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFycmF5OiBUW10pOiBUW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uY2F0KGFycmF5KTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkNvbnRhaW5zXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdDogVCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuQW55KGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICB9KTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkNvdW50XCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuV2hlcmUoZmlsdGVyKS5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkRpc3RpbmN0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHZhbHVlU2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLldoZXJlKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkZpbmRJbmRleCh5ID0+IHZhbHVlU2VsZWN0b3JGdW5jdGlvbih5KSA9PT0gdmFsdWVTZWxlY3RvckZ1bmN0aW9uKHgpKSA9PT0gaTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuV2hlcmUoKHgsIGkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuRmluZEluZGV4KHkgPT4geSA9PT0geCkgPT09IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJFdmFsdWF0ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBjb21tYW5kOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IGNvbW1hbmRQYXJ0czogc3RyaW5nW10gPSBMaW5xNEpTLkhlbHBlci5TcGxpdENvbW1hbmQoY29tbWFuZCk7XHJcblxyXG4gICAgbGV0IGNvbXB1dGVPYmplY3Q6IGFueSA9IHRoaXM7XHJcblxyXG4gICAgZm9yIChsZXQgY21kIG9mIGNvbW1hbmRQYXJ0cykge1xyXG4gICAgICAgIGxldCBjbWRSZXN1bHQgPSBMaW5xNEpTLkhlbHBlci5NYXRjaENvbW1hbmQoY21kKTtcclxuXHJcbiAgICAgICAgY29tcHV0ZU9iamVjdCA9IGNvbXB1dGVPYmplY3RbY21kUmVzdWx0LkNvbW1hbmRdKGNtZFJlc3VsdC5EeW5hbWljRnVuY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb21wdXRlT2JqZWN0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRmluZEluZGV4XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcjogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgZmlsdGVyRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGJvb2xlYW4+KGZpbHRlcik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBUID0gdGhpc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihvYmopKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBZb3UgbXVzdCBkZWZpbmUgYSBmaWx0ZXJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRmluZExhc3RJbmRleFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZpbHRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBib29sZWFuPihmaWx0ZXIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBUID0gdGhpc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihvYmopID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBZb3UgbXVzdCBkZWZpbmUgYSBmaWx0ZXJcIik7XHJcbiAgICB9XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJGaXJzdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVCB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQuR2V0KDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgRmlyc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgIH1cclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJGaXJzdE9yRGVmYXVsdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQuR2V0KDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJGb3JFYWNoXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFjdGlvbjogKChpdGVtOiBULCBpbmRleD86IG51bWJlcikgPT4gYm9vbGVhbiB8IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IGFjdGlvbkZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBpbmRleD86IG51bWJlcikgPT4gYm9vbGVhbiB8IGFueT4oYWN0aW9uLCB0cnVlKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYWN0aW9uRnVuY3Rpb24odGhpc1tpXSwgaSk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiR2V0XCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIGluZGV4OiBudW1iZXIpOiBUIHtcclxuICAgIHJldHVybiB0aGlzW2luZGV4XTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkdyb3VwQnlcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgc2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXVtdIHtcclxuICAgIGxldCBzZWxlY3RvckZ1bmN0aW9uOiAoaXRlbTogVCkgPT4gYW55ID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXVtdID0gW107XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXMuT3JkZXJCeShzZWxlY3RvckZ1bmN0aW9uKTtcclxuXHJcbiAgICBsZXQgcHJldjogVDtcclxuICAgIGxldCBuZXdTdWI6IFRbXSA9IFtdO1xyXG5cclxuICAgIG9yZGVyZWQuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RvckZ1bmN0aW9uKHByZXYpICE9PSBzZWxlY3RvckZ1bmN0aW9uKHgpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5BZGQobmV3U3ViKTtcclxuICAgICAgICAgICAgICAgIG5ld1N1YiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgTGlucTRKUy5IZWxwZXIuQ3JlYXRlQXJyYXlEYXRhKG5ld1N1Yiwge30pO1xyXG4gICAgICAgICAgICAgICAgbmV3U3ViLl9saW5xNGpzXy5Hcm91cFZhbHVlID0gc2VsZWN0b3JGdW5jdGlvbih4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIExpbnE0SlMuSGVscGVyLkNyZWF0ZUFycmF5RGF0YShuZXdTdWIsIHt9KTtcclxuICAgICAgICAgICAgbmV3U3ViLl9saW5xNGpzXy5Hcm91cFZhbHVlID0gc2VsZWN0b3JGdW5jdGlvbih4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld1N1Yi5BZGQoeCk7XHJcbiAgICAgICAgcHJldiA9IHg7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobmV3U3ViLkNvdW50KCkgPiAwKSB7XHJcbiAgICAgICAgbmV3QXJyYXkuQWRkKG5ld1N1Yik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkluc2VydFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIGluZGV4OiBudW1iZXIpOiBUW10ge1xyXG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDAsIG9iamVjdCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkludGVyc2VjdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgdGhpcy5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgIGlmIChhcnJheS5Db250YWlucyh4KSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5BZGQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXJyYXkuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAodGhhdC5Db250YWlucyh4KSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5BZGQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5LkRpc3RpbmN0KCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJKb2luXCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIGNoYXI6IHN0cmluZywgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IGFycmF5OiBhbnlbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IHRoaXMuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyYXkuam9pbihjaGFyKTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJMYXN0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBUIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0LkFueSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQocmVzdWx0Lmxlbmd0aCAtIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgTGFzdCBFbnRyeSB3YXMgbm90IGZvdW5kXCIpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkxhc3RPckRlZmF1bHRcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5XaGVyZShmaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXN1bHQuQW55KCkpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LkdldChyZXN1bHQubGVuZ3RoIC0gMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIk1heFwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5PcmRlckJ5KHZhbHVlU2VsZWN0b3JGdW5jdGlvbikuTGFzdE9yRGVmYXVsdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5PcmRlckJ5KHggPT4geCkuTGFzdE9yRGVmYXVsdCgpO1xyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiTWluXCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGlmICh2YWx1ZVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5PcmRlckJ5KHZhbHVlU2VsZWN0b3JGdW5jdGlvbikuRmlyc3RPckRlZmF1bHQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuT3JkZXJCeSh4ID0+IHgpLkZpcnN0T3JEZWZhdWx0KCk7XHJcbiAgICB9XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJNb3ZlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9sZEluZGV4OiBudW1iZXIsIG5ld0luZGV4OiBudW1iZXIpOiBUW10ge1xyXG4gICAgdGhpcy5zcGxpY2UobmV3SW5kZXgsIDAsIHRoaXMuc3BsaWNlKG9sZEluZGV4LCAxKVswXSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIk9yZGVyQnlcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXMuQ2xvbmUoKTtcclxuICAgIExpbnE0SlMuSGVscGVyLkNyZWF0ZUFycmF5RGF0YShvcmRlcmVkLCB7fSk7XHJcbiAgICBvcmRlcmVkLl9saW5xNGpzXy5PcmRlciA9IG5ldyBBcnJheTxMaW5xNEpTLk9yZGVyRW50cnk+KG5ldyBMaW5xNEpTLk9yZGVyRW50cnkoTGlucTRKUy5PcmRlckRpcmVjdGlvbi5Bc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24odmFsdWVTZWxlY3RvckZ1bmN0aW9uLCBhLCBiLCBmYWxzZSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJPcmRlckJ5RGVzY2VuZGluZ1wiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgb3JkZXJlZDogVFtdID0gdGhpcy5DbG9uZSgpO1xyXG4gICAgTGlucTRKUy5IZWxwZXIuQ3JlYXRlQXJyYXlEYXRhKG9yZGVyZWQsIHt9KTtcclxuICAgIG9yZGVyZWQuX2xpbnE0anNfLk9yZGVyID0gbmV3IEFycmF5PExpbnE0SlMuT3JkZXJFbnRyeT4obmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24odmFsdWVTZWxlY3RvckZ1bmN0aW9uLCBhLCBiLCB0cnVlKTtcclxuICAgIH0pO1xyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlJhbmdlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHN0YXJ0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogVFtdIHtcclxuICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgc3RhcnQgKyBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZCh0aGlzLkdldChpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiUmVtb3ZlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdDogVCwgcHJpbWFyeUtleVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0YXJnZXRJbmRleDogbnVtYmVyO1xyXG5cclxuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBvYmplY3QgY2Fubm90IGJlIG51bGxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNhc3RlZE9iamVjdDogTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkgPSBvYmplY3QgYXMgYW55O1xyXG5cclxuICAgIGlmIChwcmltYXJ5S2V5U2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihwcmltYXJ5S2V5U2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Rvcih4KSA9PT0gc2VsZWN0b3Iob2JqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF8gIT0gbnVsbCkge1xyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHggYXMgTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkpLl9HZW5lcmF0ZWRJZF8gPT09IGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChjYXN0ZWRPYmplY3QuSWQgIT0gbnVsbCkge1xyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHggYXMgTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkpLklkID09PSBjYXN0ZWRPYmplY3QuSWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHggPT09IG9iamVjdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0SW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBOb3RoaW5nIGZvdW5kIHRvIFJlbW92ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlJlbW92ZVJhbmdlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdHM6IFRbXSwgcHJpbWFyeUtleVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChwcmltYXJ5S2V5U2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihwcmltYXJ5S2V5U2VsZWN0b3IpO1xyXG5cclxuICAgICAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgdGhhdC5SZW1vdmUoeCwgc2VsZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgdGhhdC5SZW1vdmUoeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJSZXBlYXRcIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgb2JqZWN0OiBULCBjb3VudDogbnVtYmVyKTogVFtdIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIHRoaXMuQWRkKG9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJSZXZlcnNlXCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10pOiBUW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuQ2xvbmUoKS5yZXZlcnNlKCk7XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiU2VsZWN0XCIsIGZ1bmN0aW9uPFQsIFk+ICh0aGlzOiBUW10sIHNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IFkpIHwgc3RyaW5nKTogWVtdIHtcclxuICAgIGxldCBzZWxlY3Rvcldvcms6ICgoaXRlbTogVCkgPT4gWSkgfCBzdHJpbmcgPSBzZWxlY3RvcjtcclxuXHJcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yV29yayA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIGxldCBzZWxlY3RTdGF0ZW1lbnQgPSBzZWxlY3Rvcldvcmsuc3Vic3RyKHNlbGVjdG9yV29yay5pbmRleE9mKFwiPT5cIikgKyAoXCI9PlwiKS5sZW5ndGgpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZWN0U3RhdGVtZW50Lm1hdGNoKC9eXFxzKnsuKn1cXHMqJC8pICE9IG51bGwpIHtcclxuICAgICAgICAgICAgc2VsZWN0U3RhdGVtZW50ID0gc2VsZWN0U3RhdGVtZW50LnJlcGxhY2UoL15cXHMqeyguKil9XFxzKiQvLCBcIiQxXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcnRzID0gc2VsZWN0U3RhdGVtZW50LnNwbGl0KC8sKD89KD86W14nXCJdKlsnXCJdW14nXCJdKlsnXCJdKSpbXidcIl0qJCkvZyk7XHJcbiAgICAgICAgICAgIGxldCBuZXdDb250ZW50ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnQuaW5kZXhPZihcIjpcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29udGVudCArPSBwYXJ0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0LmluZGV4T2YoXCI9XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gcGFydC5yZXBsYWNlKFwiPVwiLCBcIjpcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBwYXJ0LnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29udGVudCArPSBuYW1lICsgXCI6XCIgKyBwYXJ0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgcGFydHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGVjdG9yV29yayA9IHNlbGVjdG9yV29yay5zdWJzdHIoMCwgc2VsZWN0b3JXb3JrLmluZGV4T2YoXCI9PlwiKSkgKyBcIj0+IHJldHVybiB7XCIgKyBuZXdDb250ZW50ICsgXCJ9XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBzZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHNlbGVjdG9yV29yaywgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogWVtdID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuX2xpbnE0anNfICYmIHRoaXMuX2xpbnE0anNfLkdyb3VwVmFsdWUpIHtcclxuICAgICAgICBuZXdBcnJheS5fbGlucTRqc18gPSB7IEdyb3VwVmFsdWU6IHRoaXMuX2xpbnE0anNfLkdyb3VwVmFsdWUsIE9yZGVyOiBbXSB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IG9iaiBvZiB0aGlzKSB7XHJcbiAgICAgICAgbmV3QXJyYXkuQWRkKHNlbGVjdG9yRnVuY3Rpb24ob2JqKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNlbGVjdE1hbnlcIiwgZnVuY3Rpb248VCwgWT4gKHRoaXM6IFRbXSwgc2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gWVtdKSB8IHN0cmluZyk6IFlbXSB7XHJcbiAgICBsZXQgbmV3QXJyYXk6IFlbXSA9IFtdO1xyXG4gICAgbGV0IHNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IFlbXT4oc2VsZWN0b3IpO1xyXG5cclxuICAgIHRoaXMuRm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IHNlbGVjdG9yRnVuY3Rpb24oaXRlbSkgfHwgW107XHJcbiAgICAgICAgbmV3QXJyYXkuQWRkUmFuZ2UoaXRlbXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNlcXVlbmNlRXF1YWxcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuQ291bnQoKSAhPT0gYXJyYXkuQ291bnQoKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXNbaV0pO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cyl7XHJcbiAgICAgICAgICAgIGlmICgodGhpc1tpXSBhcyBhbnkpW2tleV0gIT09IChhcnJheVtpXSBhcyBhbnkpW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNpbmdsZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5Db3VudCgpID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQoMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBhcnJheSBkb2VzIG5vdCBjb250YWluIGV4YWN0bHkgb25lIGVsZW1lbnRcIik7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiU2luZ2xlT3JEZWZhdWx0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0LkNvdW50KCkgPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5Db3VudCgpID4gMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgYXJyYXkgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTa2lwXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGNvdW50OiBudW1iZXIpOiBUW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoY291bnQsIHRoaXMuQ291bnQoKSk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTdW1cIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGxldCBhcnJheTogYW55W10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJheS5Gb3JFYWNoKGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJlc3VsdCArPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlRha2VcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwLCBjb3VudCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUYWtlV2hpbGVcIiwgZnVuY3Rpb248VD4gKFxyXG4gICAgdGhpczogVFtdLFxyXG4gICAgY29uZGl0aW9uOiAoKGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4pIHwgc3RyaW5nLFxyXG4gICAgaW5pdGlhbD86ICgoc3RvcmFnZTogYW55KSA9PiB2b2lkKSB8IHN0cmluZyxcclxuICAgIGFmdGVyPzogKChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgc3RyaW5nKTogVFtdIHtcclxuXHJcbiAgICBsZXQgY29uZGl0aW9uRnVuY3Rpb246IChpdGVtOiBULCBzdG9yYWdlPzogYW55KSA9PiBib29sZWFuID1cclxuICAgICAgICBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4+KGNvbmRpdGlvbik7XHJcblxyXG4gICAgbGV0IHN0b3JhZ2U6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmIChpbml0aWFsICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgaW5pdGlhbEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGluaXRpYWwpO1xyXG4gICAgICAgIGluaXRpYWxGdW5jdGlvbihzdG9yYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYWZ0ZXJGdW5jdGlvbjogKChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKGFmdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhZnRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGFmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmplY3Qgb2YgdGhpcyl7XHJcbiAgICAgICAgaWYgKGNvbmRpdGlvbkZ1bmN0aW9uKG9iamVjdCwgc3RvcmFnZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmVzdWx0LkFkZChvYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFmdGVyRnVuY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXJGdW5jdGlvbihvYmplY3QsIHN0b3JhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUaGVuQnlcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuX2xpbnE0anNfID09IG51bGwgfHwgdGhpcy5fbGlucTRqc18uT3JkZXIgPT0gbnVsbCB8fCB0aGlzLl9saW5xNGpzXy5PcmRlci5Db3VudCgpID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogUGxlYXNlIGNhbGwgT3JkZXJCeSBvciBPcmRlckJ5RGVzY2VuZGluZyBiZWZvcmUgVGhlbkJ5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGlzO1xyXG4gICAgb3JkZXJlZC5fbGlucTRqc18uT3JkZXIuQWRkKG5ldyBMaW5xNEpTLk9yZGVyRW50cnkoTGlucTRKUy5PcmRlckRpcmVjdGlvbi5Bc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygb3JkZXJlZC5fbGlucTRqc18uT3JkZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24oZW50cnkuVmFsdWVTZWxlY3RvciwgYSwgYiwgZW50cnkuRGlyZWN0aW9uID09PSBMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUaGVuQnlEZXNjZW5kaW5nXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLl9saW5xNGpzXyA9PSBudWxsIHx8IHRoaXMuX2xpbnE0anNfLk9yZGVyID09IG51bGwgfHwgdGhpcy5fbGlucTRqc18uT3JkZXIuQ291bnQoKSA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFBsZWFzZSBjYWxsIE9yZGVyQnkgb3IgT3JkZXJCeURlc2NlbmRpbmcgYmVmb3JlIFRoZW5CeURlc2NlbmRpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXM7XHJcbiAgICBvcmRlcmVkLl9saW5xNGpzXy5PcmRlci5BZGQobmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygb3JkZXJlZC5fbGlucTRqc18uT3JkZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24oZW50cnkuVmFsdWVTZWxlY3RvciwgYSwgYiwgZW50cnkuRGlyZWN0aW9uID09PSBMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUb0RpY3Rpb25hcnlcIixcclxuICAgIGZ1bmN0aW9uPFQsIFk+ICh0aGlzOiBUW10sIGtleVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IChzdHJpbmd8bnVtYmVyKSkgfCBzdHJpbmcsIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IFkpIHwgc3RyaW5nKTpcclxuICAgICAgICB7IFtwcm9wOiBzdHJpbmddOiBZLCBbcHJvcDogbnVtYmVyXTogWSB9IHtcclxuICAgIGxldCBrZXlTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiAoc3RyaW5nfG51bWJlcik+KGtleVNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgcmV0dXJuT2JqZWN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gWT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHRoaXMuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuT2JqZWN0W2tleVNlbGVjdG9yRnVuY3Rpb24oeCldID0gdmFsdWVTZWxlY3RvckZ1bmN0aW9uKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybk9iamVjdFtrZXlTZWxlY3RvckZ1bmN0aW9uKHgpXSA9IHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJldHVybk9iamVjdDtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJVbmlvblwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIHJldHVybiB0aGlzLkNvbmNhdChhcnJheSkuRGlzdGluY3QoKTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlVwZGF0ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgb2JqZWN0IGNhbm5vdCBiZSBudWxsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3IoeCkgPT09IHNlbGVjdG9yKG9iamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5fR2VuZXJhdGVkSWRfID09PSBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXztcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0LklkICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5JZCA9PT0gY2FzdGVkT2JqZWN0LklkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKG9iamVjdCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBrZXlzKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IFwiSWRcIikge1xyXG4gICAgICAgICAgICAgICAgKHRoaXNbdGFyZ2V0SW5kZXhdIGFzIGFueSlba2V5XSA9IChvYmplY3QgYXMgYW55KVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBOb3RoaW5nIGZvdW5kIHRvIFVwZGF0ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlVwZGF0ZVJhbmdlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdHM6IFRbXSwgcHJpbWFyeUtleVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChwcmltYXJ5S2V5U2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihwcmltYXJ5S2V5U2VsZWN0b3IpO1xyXG5cclxuICAgICAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgdGhhdC5VcGRhdGUoeCwgc2VsZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgdGhhdC5VcGRhdGUoeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJXaGVyZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4+KGZpbHRlcik7XHJcblxyXG4gICAgICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBUID0gdGhpc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihvYmosIGkpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG5cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlppcFwiLCBmdW5jdGlvbjxULCBYLCBZPiAodGhpczogVFtdLCBhcnJheTogWFtdLCByZXN1bHQ6ICgoZmlyc3Q6IFQsIHNlY29uZDogWCkgPT4gWSkgfCBzdHJpbmcpOiBZW10ge1xyXG4gICAgbGV0IHJlc3VsdEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChmaXJzdDogVCwgc2Vjb25kOiBYKSA9PiBZPihyZXN1bHQpO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogWVtdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFycmF5W2ldICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkuQWRkKHJlc3VsdEZ1bmN0aW9uKHRoaXNbaV0sIGFycmF5W2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7XHJcbiJdfQ==
