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
    if (this === array) {
        return true;
    }
    if (this == null || array == null) {
        return false;
    }
    if (this.length !== array.length) {
        return false;
    }
    for (var i = 0; i < this.length; i++) {
        var currentObjectThis = this[i];
        var currentObjectArray = array[i];
        if (currentObjectThis instanceof Array && currentObjectArray instanceof Array) {
            if (!currentObjectThis.SequenceEqual(currentObjectArray)) {
                return false;
            }
        }
        else if (currentObjectThis instanceof Object && currentObjectArray instanceof Object) {
            var keys = Object.keys(currentObjectThis);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (currentObjectThis[key] !== currentObjectArray[key]) {
                    return false;
                }
            }
        }
        else {
            if (currentObjectThis !== currentObjectArray) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi9FbnRpdHkudHMiLCJkZXYvRXZhbHVhdGVDb21tYW5kLnRzIiwiZGV2L0hlbHBlci50cyIsImRldi9PcmRlckVudHJ5LnRzIiwiZGV2L1NlbGVjdEVudHJ5LnRzIiwiZGV2L01vZHVsZXMvQWRkLnRzIiwiZGV2L01vZHVsZXMvQWRkUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9BZ2dyZWdhdGUudHMiLCJkZXYvTW9kdWxlcy9BbGwudHMiLCJkZXYvTW9kdWxlcy9BbnkudHMiLCJkZXYvTW9kdWxlcy9BdmVyYWdlLnRzIiwiZGV2L01vZHVsZXMvQ2xvbmUudHMiLCJkZXYvTW9kdWxlcy9Db25jYXQudHMiLCJkZXYvTW9kdWxlcy9Db250YWlucy50cyIsImRldi9Nb2R1bGVzL0NvdW50LnRzIiwiZGV2L01vZHVsZXMvRGlzdGluY3QudHMiLCJkZXYvTW9kdWxlcy9FdmFsdWF0ZS50cyIsImRldi9Nb2R1bGVzL0ZpbmRJbmRleC50cyIsImRldi9Nb2R1bGVzL0ZpbmRMYXN0SW5kZXgudHMiLCJkZXYvTW9kdWxlcy9GaXJzdC50cyIsImRldi9Nb2R1bGVzL0ZpcnN0T3JEZWZhdWx0LnRzIiwiZGV2L01vZHVsZXMvRm9yRWFjaC50cyIsImRldi9Nb2R1bGVzL0dldC50cyIsImRldi9Nb2R1bGVzL0dyb3VwQnkudHMiLCJkZXYvTW9kdWxlcy9JbnNlcnQudHMiLCJkZXYvTW9kdWxlcy9JbnRlcnNlY3QudHMiLCJkZXYvTW9kdWxlcy9Kb2luLnRzIiwiZGV2L01vZHVsZXMvTGFzdC50cyIsImRldi9Nb2R1bGVzL0xhc3RPckRlZmF1bHQudHMiLCJkZXYvTW9kdWxlcy9NYXgudHMiLCJkZXYvTW9kdWxlcy9NaW4udHMiLCJkZXYvTW9kdWxlcy9Nb3ZlLnRzIiwiZGV2L01vZHVsZXMvT3JkZXJCeS50cyIsImRldi9Nb2R1bGVzL09yZGVyQnlEZXNjZW5kaW5nLnRzIiwiZGV2L01vZHVsZXMvUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9SZW1vdmUudHMiLCJkZXYvTW9kdWxlcy9SZW1vdmVSYW5nZS50cyIsImRldi9Nb2R1bGVzL1JlcGVhdC50cyIsImRldi9Nb2R1bGVzL1JldmVyc2UudHMiLCJkZXYvTW9kdWxlcy9TZWxlY3QudHMiLCJkZXYvTW9kdWxlcy9TZWxlY3RNYW55LnRzIiwiZGV2L01vZHVsZXMvU2VxdWVuY2VFcXVhbC50cyIsImRldi9Nb2R1bGVzL1NpbmdsZS50cyIsImRldi9Nb2R1bGVzL1NpbmdsZU9yRGVmYXVsdC50cyIsImRldi9Nb2R1bGVzL1NraXAudHMiLCJkZXYvTW9kdWxlcy9TdW0udHMiLCJkZXYvTW9kdWxlcy9UYWtlLnRzIiwiZGV2L01vZHVsZXMvVGFrZVdoaWxlLnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5LnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1RvRGljdGlvbmFyeS50cyIsImRldi9Nb2R1bGVzL1VuaW9uLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9XaGVyZS50cyIsImRldi9Nb2R1bGVzL1ppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxPQUFPLENBS2hCO0FBTEQsV0FBVSxPQUFPO0lBQ2I7UUFBQTtRQUdBLENBQUM7UUFBRCxzQkFBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksdUJBQWUsa0JBRzNCLENBQUE7QUFDTCxDQUFDLEVBTFMsT0FBTyxLQUFQLE9BQU8sUUFLaEI7QUNMRCxJQUFVLE9BQU8sQ0F5Q2hCO0FBekNELFdBQVUsT0FBTztJQUNiO1FBS0kseUJBQVksT0FBZTtZQUFFLG9CQUF1QjtpQkFBdkIsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO2dCQUF2QixtQ0FBdUI7O1lBSDdDLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFDMUIsV0FBTSxHQUFhLEVBQUUsQ0FBQztZQUd6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixL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Q0FBQyxDQUFDLENBQUM7QUNuQkgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQThCLEtBQVUsRUFBRSxNQUE2QztJQUN2SCxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBNkIsTUFBTSxDQUFDLENBQUM7SUFFeEYsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO0lBRXZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNsQixRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRDtLQUNKO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoibGlucTRqcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBHZW5lcmF0ZWRFbnRpdHkge1xyXG4gICAgICAgIHB1YmxpYyBfR2VuZXJhdGVkSWRfOiBudW1iZXI7XHJcbiAgICAgICAgcHVibGljIElkOiBudW1iZXI7XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgTGlucTRKUyB7XHJcbiAgICBleHBvcnQgY2xhc3MgRXZhbHVhdGVDb21tYW5kIHtcclxuICAgICAgICBwdWJsaWMgQ29tbWFuZDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBTcGxpdFJlZ2V4OiBSZWdFeHBbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBGaW5kZXI6IFJlZ0V4cFtdID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbW1hbmQ6IHN0cmluZywgLi4uaWRlbnRpZmllcjogc3RyaW5nW10pIHtcclxuICAgICAgICAgICAgdGhpcy5Db21tYW5kID0gY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGlkIG9mIGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzU3BsaXRSZWdleDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNGaW5kZXI6IHN0cmluZztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWQuaW5kZXhPZihcInt4fVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5kZXhPZihcInt4fVwiKSA9PT0gaWQubGVuZ3RoIC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzU3BsaXRSZWdleCA9IFwiXFxcXGJcIiArIGlkLnJlcGxhY2UoXCIge3h9XCIsIFwiXCIpICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzRmluZGVyID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH1cIiwgXCJcXFxcYiAoLiopXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNTcGxpdFJlZ2V4ID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH1cIiwgXCJcXFxcYiAuKj8gXFxcXGJcIikgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNGaW5kZXIgPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fSBcIiwgXCJcXFxcYiAoLiopIFxcXFxiXCIpICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc1NwbGl0UmVnZXggPSBcIlxcXFxiXCIgKyBpZCArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgICAgICBzRmluZGVyID0gXCJcXFxcYlwiICsgaWQgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5GaW5kZXIucHVzaChuZXcgUmVnRXhwKHNGaW5kZXIsIFwiaVwiKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNwbGl0UmVnZXgucHVzaChuZXcgUmVnRXhwKHNTcGxpdFJlZ2V4LCBcImdpXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZhbHVhdGVDb21tYW5kUmVzdWx0IHtcclxuICAgICAgICBwdWJsaWMgQ29tbWFuZDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBEeW5hbWljRnVuY3Rpb246IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY21kOiBzdHJpbmcsIGZuOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5Db21tYW5kID0gY21kO1xyXG4gICAgICAgICAgICB0aGlzLkR5bmFtaWNGdW5jdGlvbiA9IGZuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBIZWxwZXIge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIENvbnZlcnRTdHJpbmdGdW5jdGlvbihmdW5jdGlvblN0cmluZzogc3RyaW5nLCBub0F1dG9SZXR1cm4/OiBib29sZWFuLCBub0JyYWNrZXRSZXBsYWNlPzogYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgICAgIGlmIChmdW5jdGlvblN0cmluZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IENhbm5vdCBjb252ZXJ0IGVtcHR5IHN0cmluZyB0byBmdW5jdGlvblwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHZhcm5hbWVTdHJpbmc6IHN0cmluZyA9IGZ1bmN0aW9uU3RyaW5nXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDAsIGZ1bmN0aW9uU3RyaW5nLmluZGV4T2YoXCI9PlwiKSlcclxuICAgICAgICAgICAgICAgIC5zcGxpdChcIiBcIikuam9pbihcIlwiKVxyXG4gICAgICAgICAgICAgICAgLnNwbGl0KFwiKFwiKS5qb2luKFwiXCIpXHJcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCIpXCIpLmpvaW4oXCJcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFybmFtZXM6IHN0cmluZ1tdID0gdmFybmFtZVN0cmluZy5zcGxpdChcIixcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZnVuYzogc3RyaW5nID0gZnVuY3Rpb25TdHJpbmdcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoZnVuY3Rpb25TdHJpbmcuaW5kZXhPZihcIj0+XCIpICsgKFwiPT5cIikubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub0JyYWNrZXRSZXBsYWNlID09IG51bGwgfHwgbm9CcmFja2V0UmVwbGFjZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMucmVwbGFjZShcIntcIiwgXCJcIikucmVwbGFjZShcIn1cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmMuc3BsaXQoXCIubWF0Y2goLy9naSlcIikuam9pbihcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub0F1dG9SZXR1cm4gPT0gbnVsbCB8fCBub0F1dG9SZXR1cm4gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAvKk5vIHJldHVybiBvdXRzaWRlIG9mIHF1b3RhdGlvbnMqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMubWF0Y2goL3JldHVybig/PShbXlxcXCInXSpbXFxcIiddW15cXFwiJ10qW1xcXCInXSkqW15cXFwiJ10qJCkvZykgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBcInJldHVybiBcIiArIGZ1bmM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbiguLi52YXJuYW1lcywgZnVuYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENvbnZlcnRGdW5jdGlvbjxUPih0ZXN0RnVuY3Rpb246IHN0cmluZyB8IFQsIG5vQXV0b1JldHVybj86IGJvb2xlYW4sIG5vQnJhY2tldFJlcGxhY2U/OiBib29sZWFuKTogVCB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IFQ7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRlc3RGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0ZXN0RnVuY3Rpb247XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlc3RGdW5jdGlvbiA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTGlucTRKUy5IZWxwZXIuQ29udmVydFN0cmluZ0Z1bmN0aW9uKHRlc3RGdW5jdGlvbiwgbm9BdXRvUmV0dXJuLCBub0JyYWNrZXRSZXBsYWNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTGlucTRKUzogQ2Fubm90IHVzZSAnJHt0ZXN0RnVuY3Rpb259JyBhcyBmdW5jdGlvbmApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBPcmRlckNvbXBhcmVGdW5jdGlvbjxUPih2YWx1ZVNlbGVjdG9yOiAoaXRlbTogVCkgPT4gYW55LCBhOiBULCBiOiBULCBpbnZlcnQ6IGJvb2xlYW4pOiBudW1iZXIge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVfYTogYW55ID0gdmFsdWVTZWxlY3RvcihhKTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlX2I6IGFueSA9IHZhbHVlU2VsZWN0b3IoYik7XHJcblxyXG4gICAgICAgICAgICBsZXQgdHlwZV9hOiBzdHJpbmcgPSB0eXBlb2YgdmFsdWVfYTtcclxuICAgICAgICAgICAgbGV0IHR5cGVfYjogc3RyaW5nID0gdHlwZW9mIHZhbHVlX2I7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZV9hID09PSBcInN0cmluZ1wiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYV9zdHJpbmc6IHN0cmluZyA9IHZhbHVlX2E7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZV9hX3N0cmluZyA9IHZhbHVlX2Ffc3RyaW5nLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYl9zdHJpbmc6IHN0cmluZyA9IHZhbHVlX2I7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZV9iX3N0cmluZyA9IHZhbHVlX2Jfc3RyaW5nLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlX2Ffc3RyaW5nID4gdmFsdWVfYl9zdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID09PSB0cnVlID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZV9hX3N0cmluZyA8IHZhbHVlX2Jfc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA9PT0gdHJ1ZSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlX2EgPT09IHR5cGVfYikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2FfbnVtYmVyOiBudW1iZXIgPSB2YWx1ZV9hO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2JfbnVtYmVyOiBudW1iZXIgPSB2YWx1ZV9iO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPT09IHRydWUgPyB2YWx1ZV9iX251bWJlciAtIHZhbHVlX2FfbnVtYmVyIDogdmFsdWVfYV9udW1iZXIgLSB2YWx1ZV9iX251bWJlcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlX2EgPT09IFwiYm9vbGVhblwiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYV9ib29sOiBib29sZWFuID0gdmFsdWVfYTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9iX2Jvb2w6IGJvb2xlYW4gPSB2YWx1ZV9iO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZV9hX2Jvb2wgPT09IHZhbHVlX2JfYm9vbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW52ZXJ0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZV9hX2Jvb2wgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlX2FfYm9vbCA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZV9hID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3BsaXRDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgbGV0IHNwbGl0SW5kZXhlczogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNtZCBvZiB0aGlzLkNvbW1hbmRzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzcGxpdCBvZiBjbWQuU3BsaXRSZWdleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBzcGxpdC5leGVjKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0SW5kZXhlcy5wdXNoKHJlc3VsdC5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc3BsaXRJbmRleGVzID0gc3BsaXRJbmRleGVzLkRpc3RpbmN0KCkuT3JkZXJCeSh4ID0+IHgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdEluZGV4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzcGxpdEluZGV4ZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY29tbWFuZC5zdWJzdHIoc3BsaXRJbmRleGVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY29tbWFuZC5zdWJzdHIoc3BsaXRJbmRleGVzW2ldLCBzcGxpdEluZGV4ZXNbaSArIDFdIC0gc3BsaXRJbmRleGVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJ0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTWF0Y2hDb21tYW5kKGNtZDogc3RyaW5nKTogRXZhbHVhdGVDb21tYW5kUmVzdWx0IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbW1hbmQgb2YgdGhpcy5Db21tYW5kcykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlZ2V4IG9mIGNvbW1hbmQuRmluZGVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gY21kLm1hdGNoKHJlZ2V4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXZhbHVhdGVDb21tYW5kUmVzdWx0KGNvbW1hbmQuQ29tbWFuZCwgcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExpbnE0SlM6IE5vIG1hdGNoaW5nIGNvbW1hbmQgd2FzIGZvdW5kIGZvciAnJHtjbWR9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDb21tYW5kczogRXZhbHVhdGVDb21tYW5kW10gPSBbXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJDbG9uZVwiLCBcImNsb25lXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiUmV2ZXJzZVwiLCBcInJldmVyc2VcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJDb250YWluc1wiLCBcImNvbnRhaW5zIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkpvaW5cIiwgXCJqb2luIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlN1bVwiLCBcInN1bSB7eH1cIiwgXCJzdW1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJBdmVyYWdlXCIsIFwiYXZlcmFnZSB7eH1cIiwgXCJhdmVyYWdlXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiV2hlcmVcIiwgXCJ3aGVyZSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTZWxlY3RNYW55XCIsIFwic2VsZWN0bWFueSB7eH1cIiwgXCJzZWxlY3QgbWFueSB7eH1cIiwgXCJzZWxlY3Qge3h9IG1hbnlcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTZWxlY3RcIiwgXCJzZWxlY3Qge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiR2V0XCIsIFwiZ2V0IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZvckVhY2hcIiwgXCJmb3JlYWNoIHt4fVwiLCBcImZvciBlYWNoIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkNvdW50XCIsIFwiY291bnRcIiwgXCJjb3VudCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJBbGxcIiwgXCJhbGwge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiQW55XCIsIFwiYW55IHt4fVwiLCBcImFueVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlRha2VXaGlsZVwiLCBcInRha2Ugd2hpbGUge3h9XCIsIFwidGFrZSB7eH0gd2hpbGVcIiwgXCJ0YWtld2hpbGUge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGFrZVwiLCBcInRha2Uge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2tpcFwiLCBcInNraXAge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiTWluXCIsIFwibWluIHt4fVwiLCBcIm1pblwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIk1heFwiLCBcIm1heCB7eH1cIiwgXCJtYXhcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJHcm91cEJ5XCIsIFwiZ3JvdXBieSB7eH1cIiwgXCJncm91cCBieSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJEaXN0aW5jdFwiLCBcImRpc3RpbmN0IHt4fVwiLCBcImRpc3RpbmN0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmluZExhc3RJbmRleFwiLCBcImZpbmRsYXN0aW5kZXgge3h9XCIsIFwiZmluZCBsYXN0IGluZGV4IHt4fVwiLCBcImZpbmRpbmRleCB7eH0gbGFzdFwiLCBcImZpbmQgaW5kZXgge3h9IGxhc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJGaW5kSW5kZXhcIiwgXCJmaW5kZmlyc3RpbmRleCB7eH1cIiwgXCJmaW5kIGZpcnN0IGluZGV4IHt4fVwiLCBcImZpbmRpbmRleCB7eH0gZmlyc3RcIiwgXCJmaW5kIGluZGV4IHt4fSBmaXJzdFwiLCBcImZpbmRpbmRleCB7eH1cIiwgXCJmaW5kIGluZGV4IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIk9yZGVyQnlEZXNjZW5kaW5nXCIsIFwib3JkZXJieSB7eH0gZGVzY2VuZGluZ1wiLCBcIm9yZGVyIGJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwib3JkZXJieSBkZXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyYnlkZXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyIGJ5IGRlc2NlbmRpbmcge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiT3JkZXJCeVwiLCBcIm9yZGVyYnkge3h9IGFzY2VuZGluZ1wiLCBcIm9yZGVyIGJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJvcmRlcmJ5YXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyIGJ5IGFzY2VuZGluZyB7eH1cIiwgXCJvcmRlcmJ5IHt4fVwiLCBcIm9yZGVyIGJ5IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpcnN0T3JEZWZhdWx0XCIsIFwiZmlyc3RvcmRlZmF1bHQge3h9XCIsIFwiZmlyc3Qgb3IgZGVmYXVsdCB7eH1cIiwgXCJmaXJzdG9yZGVmYXVsdFwiLCBcImZpcnN0IG9yIGRlZmF1bHRcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJMYXN0T3JEZWZhdWx0XCIsIFwibGFzdG9yZGVmYXVsdCB7eH1cIiwgXCJsYXN0IG9yIGRlZmF1bHQge3h9XCIsIFwibGFzdG9yZGVmYXVsdFwiLCBcImxhc3Qgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlNpbmdsZU9yRGVmYXVsdFwiLCBcInNpbmdsZW9yZGVmYXVsdCB7eH1cIiwgXCJzaW5nbGUgb3IgZGVmYXVsdCB7eH1cIiwgXCJzaW5nbGVvcmRlZmF1bHRcIiwgXCJzaW5nbGUgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpcnN0XCIsIFwiZmlyc3Qge3h9XCIsIFwiZmlyc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJMYXN0XCIsIFwibGFzdCB7eH1cIiwgXCJsYXN0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2luZ2xlXCIsIFwic2luZ2xlIHt4fVwiLCBcInNpbmdsZVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlRoZW5CeURlc2NlbmRpbmdcIiwgXCJ0aGVuYnkge3h9IGRlc2NlbmRpbmdcIiwgXCJ0aGVuIGJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwidGhlbmJ5ZGVzY2VuZGluZyB7eH1cIiwgXCJ0aGVuIGJ5IGRlc2NlbmRpbmcge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGhlbkJ5XCIsIFwidGhlbmJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJ0aGVuIGJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJ0aGVuYnlhc2NlbmRpbmcge3h9XCIsIFwidGhlbiBieSBhc2NlbmRpbmcge3h9XCIsIFwidGhlbmJ5IHt4fVwiLCBcInRoZW4gYnkge3h9XCIpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBOb25FbnVtZXJhYmxlKG5hbWU6IHN0cmluZywgdmFsdWU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIG5hbWUsIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDcmVhdGVBcnJheURhdGEoYXJyYXk6IGFueVtdLCB2YWx1ZTogYW55ID0ge30pIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LCBcIl9saW5xNGpzX1wiLCB7XHJcbiAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBPcmRlckVudHJ5IHtcclxuICAgICAgICBwdWJsaWMgRGlyZWN0aW9uOiBPcmRlckRpcmVjdGlvbjtcclxuICAgICAgICBwdWJsaWMgVmFsdWVTZWxlY3RvcjogKGl0ZW06IGFueSkgPT4gYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihfZGlyZWN0aW9uOiBPcmRlckRpcmVjdGlvbiwgX3ZhbHVlU2VsZWN0b3I6IChpdGVtOiBhbnkpID0+IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLkRpcmVjdGlvbiA9IF9kaXJlY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMuVmFsdWVTZWxlY3RvciA9IF92YWx1ZVNlbGVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZW51bSBPcmRlckRpcmVjdGlvbiB7XHJcbiAgICAgICAgQXNjZW5kaW5nLCBEZXNjZW5kaW5nXHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgTGlucTRKUyB7XHJcbiAgICBleHBvcnQgY2xhc3MgU2VsZWN0RW50cnkge1xyXG4gICAgICAgIHB1YmxpYyBwcm9wZXJ0eTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKG46IHN0cmluZywgcDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG47XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHkgPSBwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJBZGRcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBnZW5lcmF0ZUlkPzogYm9vbGVhbik6IFRbXSB7XHJcbiAgICBpZiAob2JqZWN0ICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZ2VuZXJhdGVJZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBsZXQgbmV3SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuICAgICAgICAgICAgbGV0IGxhc3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gdGhpcy5XaGVyZSgoeDogYW55KSA9PiB4Ll9HZW5lcmF0ZWRJZF8gIT0gbnVsbCkuT3JkZXJCeSgoeDogYW55KSA9PiB4Ll9HZW5lcmF0ZWRJZF8pLkxhc3RPckRlZmF1bHQoKSBhcyBhbnk7XHJcbiAgICAgICAgICAgIGlmIChsYXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbGFzdC5fR2VuZXJhdGVkSWRfICE9IG51bGwgPyBsYXN0Ll9HZW5lcmF0ZWRJZF8gOiAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLkFueShmdW5jdGlvbih4OiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHggYXMgTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkpLl9HZW5lcmF0ZWRJZF8gPT09IG5ld0luZGV4O1xyXG4gICAgICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXyA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHVzaChvYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQWRkUmFuZ2VcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0czogVFtdLCBnZW5lcmF0ZUlkOiBib29sZWFuKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgIHRoYXQuQWRkKHgsIGdlbmVyYXRlSWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJBZ2dyZWdhdGVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgbWV0aG9kOiAoKHJlc3VsdDogYW55LCBpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nLCBzdGFydFZhbD86IGFueSk6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVzdWx0OiBhbnk7XHJcblxyXG4gICAgaWYgKHN0YXJ0VmFsICE9IG51bGwpIHtcclxuICAgICAgICByZXN1bHQgPSBzdGFydFZhbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWV0aG9kRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KHJlc3VsdDogYW55LCBpdGVtOiBUKSA9PiBhbnk+KG1ldGhvZCk7XHJcblxyXG4gICAgdGhpcy5Gb3JFYWNoKGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJlc3VsdCA9IG1ldGhvZEZ1bmN0aW9uKHJlc3VsdCwgeCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQWxsXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcjogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuQ291bnQoZmlsdGVyKSA9PT0gdGhpcy5Db3VudCgpO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQW55XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLkNvdW50KGZpbHRlcikgPiAwO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiQXZlcmFnZVwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBzZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZywgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSAwO1xyXG4gICAgbGV0IGFycmF5OiBhbnlbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgYXJyYXkgPSBhcnJheS5XaGVyZShmaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgYXJyYXkgPSBhcnJheS5TZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmF5LkZvckVhY2goZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmVzdWx0ICs9IHg7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0IC8gYXJyYXkuQ291bnQoKTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkNsb25lXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10pOiBUW10ge1xyXG4gICAgbGV0IG5ld0FycmF5OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmogb2YgdGhpcykge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkNvbmNhdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIHJldHVybiB0aGlzLmNvbmNhdChhcnJheSk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJDb250YWluc1wiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLkFueShmdW5jdGlvbih4KXtcclxuICAgICAgICByZXR1cm4geCA9PT0gb2JqZWN0O1xyXG4gICAgfSk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJDb3VudFwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLldoZXJlKGZpbHRlcikubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGg7XHJcbiAgICB9XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJEaXN0aW5jdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmICh2YWx1ZVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5XaGVyZSgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5GaW5kSW5kZXgoeSA9PiB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24oeSkgPT09IHZhbHVlU2VsZWN0b3JGdW5jdGlvbih4KSkgPT09IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLldoZXJlKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkZpbmRJbmRleCh5ID0+IHkgPT09IHgpID09PSBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRXZhbHVhdGVcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY29tbWFuZDogc3RyaW5nKTogYW55IHtcclxuICAgIGxldCBjb21tYW5kUGFydHM6IHN0cmluZ1tdID0gTGlucTRKUy5IZWxwZXIuU3BsaXRDb21tYW5kKGNvbW1hbmQpO1xyXG5cclxuICAgIGxldCBjb21wdXRlT2JqZWN0OiBhbnkgPSB0aGlzO1xyXG5cclxuICAgIGZvciAobGV0IGNtZCBvZiBjb21tYW5kUGFydHMpIHtcclxuICAgICAgICBsZXQgY21kUmVzdWx0ID0gTGlucTRKUy5IZWxwZXIuTWF0Y2hDb21tYW5kKGNtZCk7XHJcblxyXG4gICAgICAgIGNvbXB1dGVPYmplY3QgPSBjb21wdXRlT2JqZWN0W2NtZFJlc3VsdC5Db21tYW5kXShjbWRSZXN1bHQuRHluYW1pY0Z1bmN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY29tcHV0ZU9iamVjdDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkZpbmRJbmRleFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZpbHRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBib29sZWFuPihmaWx0ZXIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG9iajogVCA9IHRoaXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRnVuY3Rpb24ob2JqKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkZpbmRMYXN0SW5kZXhcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYm9vbGVhbj4oZmlsdGVyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgbGV0IG9iajogVCA9IHRoaXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRnVuY3Rpb24ob2JqKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRmlyc3RcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IFQge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5XaGVyZShmaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXN1bHQuQW55KCkpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIEZpcnN0IEVudHJ5IHdhcyBub3QgZm91bmRcIik7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRmlyc3RPckRlZmF1bHRcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5XaGVyZShmaWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXN1bHQuQW55KCkpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiRm9yRWFjaFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhY3Rpb246ICgoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4gfCBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCBhY3Rpb25GdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4gfCBhbnk+KGFjdGlvbiwgdHJ1ZSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGFjdGlvbkZ1bmN0aW9uKHRoaXNbaV0sIGkpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIkdldFwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBpbmRleDogbnVtYmVyKTogVCB7XHJcbiAgICByZXR1cm4gdGhpc1tpbmRleF07XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJHcm91cEJ5XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW11bXSB7XHJcbiAgICBsZXQgc2VsZWN0b3JGdW5jdGlvbjogKGl0ZW06IFQpID0+IGFueSA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihzZWxlY3Rvcik7XHJcblxyXG4gICAgbGV0IG5ld0FycmF5OiBUW11bXSA9IFtdO1xyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGlzLk9yZGVyQnkoc2VsZWN0b3JGdW5jdGlvbik7XHJcblxyXG4gICAgbGV0IHByZXY6IFQ7XHJcbiAgICBsZXQgbmV3U3ViOiBUW10gPSBbXTtcclxuXHJcbiAgICBvcmRlcmVkLkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3JGdW5jdGlvbihwcmV2KSAhPT0gc2VsZWN0b3JGdW5jdGlvbih4KSkge1xyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXkuQWRkKG5ld1N1Yik7XHJcbiAgICAgICAgICAgICAgICBuZXdTdWIgPSBbXTtcclxuICAgICAgICAgICAgICAgIExpbnE0SlMuSGVscGVyLkNyZWF0ZUFycmF5RGF0YShuZXdTdWIsIHt9KTtcclxuICAgICAgICAgICAgICAgIG5ld1N1Yi5fbGlucTRqc18uR3JvdXBWYWx1ZSA9IHNlbGVjdG9yRnVuY3Rpb24oeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMaW5xNEpTLkhlbHBlci5DcmVhdGVBcnJheURhdGEobmV3U3ViLCB7fSk7XHJcbiAgICAgICAgICAgIG5ld1N1Yi5fbGlucTRqc18uR3JvdXBWYWx1ZSA9IHNlbGVjdG9yRnVuY3Rpb24oeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdTdWIuQWRkKHgpO1xyXG4gICAgICAgIHByZXYgPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG5ld1N1Yi5Db3VudCgpID4gMCkge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChuZXdTdWIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJJbnNlcnRcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBpbmRleDogbnVtYmVyKTogVFtdIHtcclxuICAgIHRoaXMuc3BsaWNlKGluZGV4LCAwLCBvYmplY3QpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJJbnRlcnNlY3RcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgIHRoaXMuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAoYXJyYXkuQ29udGFpbnMoeCkpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkuQWRkKHgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFycmF5LkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgaWYgKHRoYXQuQ29udGFpbnMoeCkpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkuQWRkKHgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBuZXdBcnJheS5EaXN0aW5jdCgpO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiSm9pblwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBjaGFyOiBzdHJpbmcsIHNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBhcnJheTogYW55W10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgYXJyYXkgPSB0aGlzLlNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFycmF5LmpvaW4oY2hhcik7XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiTGFzdFwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVCB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQuR2V0KHJlc3VsdC5sZW5ndGggLSAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIExhc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgIH1cclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJMYXN0T3JEZWZhdWx0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0LkFueSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQocmVzdWx0Lmxlbmd0aCAtIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJNYXhcIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgdmFsdWVTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgaWYgKHZhbHVlU2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuT3JkZXJCeSh2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pLkxhc3RPckRlZmF1bHQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuT3JkZXJCeSh4ID0+IHgpLkxhc3RPckRlZmF1bHQoKTtcclxuICAgIH1cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIk1pblwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuT3JkZXJCeSh2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pLkZpcnN0T3JEZWZhdWx0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLk9yZGVyQnkoeCA9PiB4KS5GaXJzdE9yRGVmYXVsdCgpO1xyXG4gICAgfVxyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiTW92ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvbGRJbmRleDogbnVtYmVyLCBuZXdJbmRleDogbnVtYmVyKTogVFtdIHtcclxuICAgIHRoaXMuc3BsaWNlKG5ld0luZGV4LCAwLCB0aGlzLnNwbGljZShvbGRJbmRleCwgMSlbMF0pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJPcmRlckJ5XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGlzLkNsb25lKCk7XHJcbiAgICBMaW5xNEpTLkhlbHBlci5DcmVhdGVBcnJheURhdGEob3JkZXJlZCwge30pO1xyXG4gICAgb3JkZXJlZC5fbGlucTRqc18uT3JkZXIgPSBuZXcgQXJyYXk8TGlucTRKUy5PcmRlckVudHJ5PihuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uQXNjZW5kaW5nLCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pKTtcclxuXHJcbiAgICByZXR1cm4gb3JkZXJlZC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKHZhbHVlU2VsZWN0b3JGdW5jdGlvbiwgYSwgYiwgZmFsc2UpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiT3JkZXJCeURlc2NlbmRpbmdcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXMuQ2xvbmUoKTtcclxuICAgIExpbnE0SlMuSGVscGVyLkNyZWF0ZUFycmF5RGF0YShvcmRlcmVkLCB7fSk7XHJcbiAgICBvcmRlcmVkLl9saW5xNGpzXy5PcmRlciA9IG5ldyBBcnJheTxMaW5xNEpTLk9yZGVyRW50cnk+KG5ldyBMaW5xNEpTLk9yZGVyRW50cnkoTGlucTRKUy5PcmRlckRpcmVjdGlvbi5EZXNjZW5kaW5nLCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pKTtcclxuXHJcbiAgICByZXR1cm4gb3JkZXJlZC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKHZhbHVlU2VsZWN0b3JGdW5jdGlvbiwgYSwgYiwgdHJ1ZSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJSYW5nZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBzdGFydDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBuZXdBcnJheS5BZGQodGhpcy5HZXQoaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlJlbW92ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgb2JqZWN0IGNhbm5vdCBiZSBudWxsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3IoeCkgPT09IHNlbGVjdG9yKG9iamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5fR2VuZXJhdGVkSWRfID09PSBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXztcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0LklkICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5JZCA9PT0gY2FzdGVkT2JqZWN0LklkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc3BsaWNlKHRhcmdldEluZGV4LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogTm90aGluZyBmb3VuZCB0byBSZW1vdmVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJSZW1vdmVSYW5nZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3RzOiBUW10sIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuUmVtb3ZlKHgsIHNlbGVjdG9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuUmVtb3ZlKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiUmVwZWF0XCIsIGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIG9iamVjdDogVCwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICB0aGlzLkFkZChvYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59KTsiLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiUmV2ZXJzZVwiLCBmdW5jdGlvbiA8VD4odGhpczogVFtdKTogVFtdIHtcclxuICAgIHJldHVybiB0aGlzLkNsb25lKCkucmV2ZXJzZSgpO1xyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNlbGVjdFwiLCBmdW5jdGlvbjxULCBZPiAodGhpczogVFtdLCBzZWxlY3RvcjogKChpdGVtOiBUKSA9PiBZKSB8IHN0cmluZyk6IFlbXSB7XHJcbiAgICBsZXQgc2VsZWN0b3JXb3JrOiAoKGl0ZW06IFQpID0+IFkpIHwgc3RyaW5nID0gc2VsZWN0b3I7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvcldvcmsgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBsZXQgc2VsZWN0U3RhdGVtZW50ID0gc2VsZWN0b3JXb3JrLnN1YnN0cihzZWxlY3RvcldvcmsuaW5kZXhPZihcIj0+XCIpICsgKFwiPT5cIikubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdFN0YXRlbWVudC5tYXRjaCgvXlxccyp7Lip9XFxzKiQvKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdFN0YXRlbWVudCA9IHNlbGVjdFN0YXRlbWVudC5yZXBsYWNlKC9eXFxzKnsoLiopfVxccyokLywgXCIkMVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IHNlbGVjdFN0YXRlbWVudC5zcGxpdCgvLCg/PSg/OlteJ1wiXSpbJ1wiXVteJ1wiXSpbJ1wiXSkqW14nXCJdKiQpL2cpO1xyXG4gICAgICAgICAgICBsZXQgbmV3Q29udGVudCA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0LmluZGV4T2YoXCI6XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gcGFydDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdDb250ZW50ICs9IHBhcnQucmVwbGFjZShcIj1cIiwgXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gcGFydC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gbmFtZSArIFwiOlwiICsgcGFydDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHBhcnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdDb250ZW50ICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RvcldvcmsgPSBzZWxlY3Rvcldvcmsuc3Vic3RyKDAsIHNlbGVjdG9yV29yay5pbmRleE9mKFwiPT5cIikpICsgXCI9PiByZXR1cm4ge1wiICsgbmV3Q29udGVudCArIFwifVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihzZWxlY3RvcldvcmssIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFlbXSA9IFtdO1xyXG5cclxuICAgIGlmICh0aGlzLl9saW5xNGpzXyAmJiB0aGlzLl9saW5xNGpzXy5Hcm91cFZhbHVlKSB7XHJcbiAgICAgICAgbmV3QXJyYXkuX2xpbnE0anNfID0geyBHcm91cFZhbHVlOiB0aGlzLl9saW5xNGpzXy5Hcm91cFZhbHVlLCBPcmRlcjogW10gfTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBvYmogb2YgdGhpcykge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChzZWxlY3RvckZ1bmN0aW9uKG9iaikpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTZWxlY3RNYW55XCIsIGZ1bmN0aW9uPFQsIFk+ICh0aGlzOiBUW10sIHNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IFlbXSkgfCBzdHJpbmcpOiBZW10ge1xyXG4gICAgbGV0IG5ld0FycmF5OiBZW10gPSBbXTtcclxuICAgIGxldCBzZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBZW10+KHNlbGVjdG9yKTtcclxuXHJcbiAgICB0aGlzLkZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICBsZXQgaXRlbXMgPSBzZWxlY3RvckZ1bmN0aW9uKGl0ZW0pIHx8IFtdO1xyXG4gICAgICAgIG5ld0FycmF5LkFkZFJhbmdlKGl0ZW1zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTZXF1ZW5jZUVxdWFsXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFycmF5OiBUW10pOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzID09PSBhcnJheSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzID09IG51bGwgfHwgYXJyYXkgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5sZW5ndGggIT09IGFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50T2JqZWN0VGhpczogYW55ID0gdGhpc1tpXTtcclxuICAgICAgICBjb25zdCBjdXJyZW50T2JqZWN0QXJyYXk6IGFueSA9IGFycmF5W2ldO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudE9iamVjdFRoaXMgaW5zdGFuY2VvZiBBcnJheSAmJiBjdXJyZW50T2JqZWN0QXJyYXkgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRPYmplY3RUaGlzLlNlcXVlbmNlRXF1YWwoY3VycmVudE9iamVjdEFycmF5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50T2JqZWN0VGhpcyBpbnN0YW5jZW9mIE9iamVjdCAmJiBjdXJyZW50T2JqZWN0QXJyYXkgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhjdXJyZW50T2JqZWN0VGhpcyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE9iamVjdFRoaXNba2V5XSAhPT0gY3VycmVudE9iamVjdEFycmF5W2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudE9iamVjdFRoaXMgIT09IGN1cnJlbnRPYmplY3RBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59KTtcclxuIiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlNpbmdsZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5Db3VudCgpID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQoMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBhcnJheSBkb2VzIG5vdCBjb250YWluIGV4YWN0bHkgb25lIGVsZW1lbnRcIik7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJMaW5xNEpTLkhlbHBlci5Ob25FbnVtZXJhYmxlKFwiU2luZ2xlT3JEZWZhdWx0XCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0LkNvdW50KCkgPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5Db3VudCgpID4gMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgYXJyYXkgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTa2lwXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGNvdW50OiBudW1iZXIpOiBUW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoY291bnQsIHRoaXMuQ291bnQoKSk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJTdW1cIiwgZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGxldCBhcnJheTogYW55W10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJheS5Gb3JFYWNoKGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJlc3VsdCArPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlRha2VcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwLCBjb3VudCk7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUYWtlV2hpbGVcIiwgZnVuY3Rpb248VD4gKFxyXG4gICAgdGhpczogVFtdLFxyXG4gICAgY29uZGl0aW9uOiAoKGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4pIHwgc3RyaW5nLFxyXG4gICAgaW5pdGlhbD86ICgoc3RvcmFnZTogYW55KSA9PiB2b2lkKSB8IHN0cmluZyxcclxuICAgIGFmdGVyPzogKChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgc3RyaW5nKTogVFtdIHtcclxuXHJcbiAgICBsZXQgY29uZGl0aW9uRnVuY3Rpb246IChpdGVtOiBULCBzdG9yYWdlPzogYW55KSA9PiBib29sZWFuID1cclxuICAgICAgICBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4+KGNvbmRpdGlvbik7XHJcblxyXG4gICAgbGV0IHN0b3JhZ2U6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmIChpbml0aWFsICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgaW5pdGlhbEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGluaXRpYWwpO1xyXG4gICAgICAgIGluaXRpYWxGdW5jdGlvbihzdG9yYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYWZ0ZXJGdW5jdGlvbjogKChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKGFmdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhZnRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGFmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmplY3Qgb2YgdGhpcyl7XHJcbiAgICAgICAgaWYgKGNvbmRpdGlvbkZ1bmN0aW9uKG9iamVjdCwgc3RvcmFnZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmVzdWx0LkFkZChvYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFmdGVyRnVuY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXJGdW5jdGlvbihvYmplY3QsIHN0b3JhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUaGVuQnlcIiwgZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuX2xpbnE0anNfID09IG51bGwgfHwgdGhpcy5fbGlucTRqc18uT3JkZXIgPT0gbnVsbCB8fCB0aGlzLl9saW5xNGpzXy5PcmRlci5Db3VudCgpID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogUGxlYXNlIGNhbGwgT3JkZXJCeSBvciBPcmRlckJ5RGVzY2VuZGluZyBiZWZvcmUgVGhlbkJ5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGlzO1xyXG4gICAgb3JkZXJlZC5fbGlucTRqc18uT3JkZXIuQWRkKG5ldyBMaW5xNEpTLk9yZGVyRW50cnkoTGlucTRKUy5PcmRlckRpcmVjdGlvbi5Bc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygb3JkZXJlZC5fbGlucTRqc18uT3JkZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24oZW50cnkuVmFsdWVTZWxlY3RvciwgYSwgYiwgZW50cnkuRGlyZWN0aW9uID09PSBMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUaGVuQnlEZXNjZW5kaW5nXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLl9saW5xNGpzXyA9PSBudWxsIHx8IHRoaXMuX2xpbnE0anNfLk9yZGVyID09IG51bGwgfHwgdGhpcy5fbGlucTRqc18uT3JkZXIuQ291bnQoKSA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFBsZWFzZSBjYWxsIE9yZGVyQnkgb3IgT3JkZXJCeURlc2NlbmRpbmcgYmVmb3JlIFRoZW5CeURlc2NlbmRpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoaXM7XHJcbiAgICBvcmRlcmVkLl9saW5xNGpzXy5PcmRlci5BZGQobmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2Ygb3JkZXJlZC5fbGlucTRqc18uT3JkZXIpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24oZW50cnkuVmFsdWVTZWxlY3RvciwgYSwgYiwgZW50cnkuRGlyZWN0aW9uID09PSBMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJUb0RpY3Rpb25hcnlcIixcclxuICAgIGZ1bmN0aW9uPFQsIFk+ICh0aGlzOiBUW10sIGtleVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IChzdHJpbmd8bnVtYmVyKSkgfCBzdHJpbmcsIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IFkpIHwgc3RyaW5nKTpcclxuICAgICAgICB7IFtwcm9wOiBzdHJpbmddOiBZLCBbcHJvcDogbnVtYmVyXTogWSB9IHtcclxuICAgIGxldCBrZXlTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiAoc3RyaW5nfG51bWJlcik+KGtleVNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgcmV0dXJuT2JqZWN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gWT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHRoaXMuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuT2JqZWN0W2tleVNlbGVjdG9yRnVuY3Rpb24oeCldID0gdmFsdWVTZWxlY3RvckZ1bmN0aW9uKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybk9iamVjdFtrZXlTZWxlY3RvckZ1bmN0aW9uKHgpXSA9IHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJldHVybk9iamVjdDtcclxufSk7XHJcbiIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJVbmlvblwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIHJldHVybiB0aGlzLkNvbmNhdChhcnJheSkuRGlzdGluY3QoKTtcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlVwZGF0ZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgb2JqZWN0IGNhbm5vdCBiZSBudWxsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3IoeCkgPT09IHNlbGVjdG9yKG9iamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5fR2VuZXJhdGVkSWRfID09PSBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXztcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0LklkICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5JZCA9PT0gY2FzdGVkT2JqZWN0LklkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKG9iamVjdCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBrZXlzKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IFwiSWRcIikge1xyXG4gICAgICAgICAgICAgICAgKHRoaXNbdGFyZ2V0SW5kZXhdIGFzIGFueSlba2V5XSA9IChvYmplY3QgYXMgYW55KVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBOb3RoaW5nIGZvdW5kIHRvIFVwZGF0ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlVwZGF0ZVJhbmdlXCIsIGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdHM6IFRbXSwgcHJpbWFyeUtleVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChwcmltYXJ5S2V5U2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihwcmltYXJ5S2V5U2VsZWN0b3IpO1xyXG5cclxuICAgICAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgdGhhdC5VcGRhdGUoeCwgc2VsZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgdGhhdC5VcGRhdGUoeCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn0pOyIsIkxpbnE0SlMuSGVscGVyLk5vbkVudW1lcmFibGUoXCJXaGVyZVwiLCBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4+KGZpbHRlcik7XHJcblxyXG4gICAgICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBUID0gdGhpc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihvYmosIGkpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG5cclxufSk7IiwiTGlucTRKUy5IZWxwZXIuTm9uRW51bWVyYWJsZShcIlppcFwiLCBmdW5jdGlvbjxULCBYLCBZPiAodGhpczogVFtdLCBhcnJheTogWFtdLCByZXN1bHQ6ICgoZmlyc3Q6IFQsIHNlY29uZDogWCkgPT4gWSkgfCBzdHJpbmcpOiBZW10ge1xyXG4gICAgbGV0IHJlc3VsdEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChmaXJzdDogVCwgc2Vjb25kOiBYKSA9PiBZPihyZXN1bHQpO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogWVtdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFycmF5W2ldICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkuQWRkKHJlc3VsdEZ1bmN0aW9uKHRoaXNbaV0sIGFycmF5W2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufSk7XHJcbiJdfQ==
