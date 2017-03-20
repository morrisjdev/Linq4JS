"use strict";
var Linq4JS;
(function (Linq4JS) {
    var GeneratedEntity = (function () {
        function GeneratedEntity() {
        }
        return GeneratedEntity;
    }());
    Linq4JS.GeneratedEntity = GeneratedEntity;
})(Linq4JS || (Linq4JS = {}));
"use strict";
var Linq4JS;
(function (Linq4JS) {
    var EvaluateCommand = (function () {
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
    var EvaluateCommandResult = (function () {
        function EvaluateCommandResult(cmd, fn) {
            this.Command = cmd;
            this.DynamicFunction = fn;
        }
        return EvaluateCommandResult;
    }());
    Linq4JS.EvaluateCommandResult = EvaluateCommandResult;
})(Linq4JS || (Linq4JS = {}));
"use strict";
var Linq4JS;
(function (Linq4JS) {
    var Helper = (function () {
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
        return Helper;
    }());
    Helper.Commands = [
        new Linq4JS.EvaluateCommand("Clone", "clone"),
        new Linq4JS.EvaluateCommand("Reverse", "reverse"),
        new Linq4JS.EvaluateCommand("Where", "where {x}"),
        new Linq4JS.EvaluateCommand("Select", "select {x}"),
        new Linq4JS.EvaluateCommand("Get", "get {x}"),
        new Linq4JS.EvaluateCommand("ForEach", "foreach {x}", "for each {x}"),
        new Linq4JS.EvaluateCommand("Count", "count", "count {x}"),
        new Linq4JS.EvaluateCommand("All", "all {x}"),
        new Linq4JS.EvaluateCommand("Any", "any {x}", "any"),
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
        new Linq4JS.EvaluateCommand("First", "first {x}", "first"),
        new Linq4JS.EvaluateCommand("Last", "last {x}", "last"),
        new Linq4JS.EvaluateCommand("ThenByDescending", "thenby {x} descending", "then by {x} descending", "thenbydescending {x}", "then by descending {x}"),
        new Linq4JS.EvaluateCommand("ThenBy", "thenby {x} ascending", "then by {x} ascending", "thenbyascending {x}", "then by ascending {x}", "thenby {x}", "then by {x}")
    ];
    Linq4JS.Helper = Helper;
})(Linq4JS || (Linq4JS = {}));
"use strict";
"use strict";
Array.prototype.Add = function (object, generateId) {
    var that = this;
    if (object != null) {
        if (generateId === true) {
            var newIndex_1;
            var castedObject = object;
            var last = that.Where(function (x) { return x._GeneratedId_ != null; }).OrderBy(function (x) { return x._GeneratedId_; }).LastOrDefault();
            if (last != null) {
                newIndex_1 = last._GeneratedId_ != null ? last._GeneratedId_ : 1;
                while (that.Any(function (x) {
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
        that.push(object);
    }
    return that;
};
"use strict";
Array.prototype.AddRange = function (objects, generateId) {
    var that = this;
    objects.ForEach(function (x) {
        that.Add(x, generateId);
    });
    return that;
};
"use strict";
Array.prototype.Aggregate = function (method, startVal) {
    var that = this;
    var result;
    if (startVal != null) {
        result = startVal;
    }
    else {
        result = "";
    }
    var methodFunction = Linq4JS.Helper.ConvertFunction(method);
    that.ForEach(function (x) {
        result = methodFunction(result, x);
    });
    return result;
};
"use strict";
Array.prototype.All = function (filter) {
    var that = this;
    return that.Count(filter) === that.Count();
};
"use strict";
Array.prototype.Any = function (filter) {
    var that = this;
    return that.Count(filter) > 0;
};
"use strict";
Array.prototype.Average = function (selector, filter) {
    var that = this;
    var result = 0;
    var array = that;
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
};
"use strict";
Array.prototype.Clone = function () {
    var that = this;
    var newArray = [];
    for (var _i = 0, that_1 = that; _i < that_1.length; _i++) {
        var obj = that_1[_i];
        newArray.Add(obj);
    }
    return newArray;
};
"use strict";
Array.prototype.Concat = function (array) {
    var that = this;
    that = that.concat(array);
    return that;
};
"use strict";
Array.prototype.Contains = function (object) {
    var that = this;
    return that.Any(function (x) {
        return x === object;
    });
};
"use strict";
Array.prototype.Count = function (filter) {
    var that = this;
    if (filter != null) {
        return that.Where(filter).length;
    }
    else {
        return that.length;
    }
};
"use strict";
Array.prototype.Distinct = function (valueSelector) {
    var that = this;
    if (valueSelector != null) {
        var valueSelectorFunction_1 = Linq4JS.Helper.ConvertFunction(valueSelector);
        return that.Where(function (x, i) {
            return that.FindIndex(function (y) { return valueSelectorFunction_1(y) === valueSelectorFunction_1(x); }) === i;
        });
    }
    else {
        return that.Where(function (x, i) {
            return that.FindIndex(function (y) { return y === x; }) === i;
        });
    }
};
"use strict";
Array.prototype.Evaluate = function (command) {
    var that = this;
    var commandParts = Linq4JS.Helper.SplitCommand(command);
    var computeObject = that;
    for (var _i = 0, commandParts_1 = commandParts; _i < commandParts_1.length; _i++) {
        var cmd = commandParts_1[_i];
        var cmdResult = Linq4JS.Helper.MatchCommand(cmd);
        computeObject = computeObject[cmdResult.Command](cmdResult.DynamicFunction);
    }
    return computeObject;
};
"use strict";
Array.prototype.FindIndex = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        for (var i = 0; i < that.length; i++) {
            var obj = that[i];
            if (filterFunction(obj) === true) {
                return i;
            }
        }
        return -1;
    }
    else {
        throw new Error("Linq4JS: You must define a filter");
    }
};
"use strict";
Array.prototype.FindLastIndex = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        for (var i = that.length - 1; i >= 0; i--) {
            var obj = that[i];
            if (filterFunction(obj) === true) {
                return i;
            }
        }
        return -1;
    }
    else {
        throw new Error("Linq4JS: You must define a filter");
    }
};
"use strict";
Array.prototype.First = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(0);
        }
        else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    }
    else {
        if (that.Any()) {
            return that.Get(0);
        }
        else {
            throw new Error("Linq4JS: The First Entry was not found");
        }
    }
};
"use strict";
Array.prototype.FirstOrDefault = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(0);
        }
        else {
            return null;
        }
    }
    else {
        if (that.Any()) {
            return that.Get(0);
        }
        else {
            return null;
        }
    }
};
"use strict";
Array.prototype.ForEach = function (action) {
    var that = this;
    var actionFunction = Linq4JS.Helper.ConvertFunction(action, true);
    for (var i = 0; i < that.length; i++) {
        var result = actionFunction(that[i], i);
        if (result != null && result === true) {
            break;
        }
    }
    return that;
};
"use strict";
Array.prototype.Get = function (index) {
    var that = this;
    return that[index];
};
"use strict";
Array.prototype.GroupBy = function (selector) {
    var that = this;
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selector);
    var newArray = [];
    var ordered = that.OrderBy(selectorFunction);
    var prev;
    var newSub = [];
    ordered.ForEach(function (x) {
        if (prev != null) {
            if (selectorFunction(prev) !== selectorFunction(x)) {
                newArray.Add(newSub);
                newSub = [];
                newSub.GroupValue = selectorFunction(x);
            }
        }
        else {
            newSub.GroupValue = selectorFunction(x);
        }
        newSub.Add(x);
        prev = x;
    });
    if (newSub.Count() > 0) {
        newArray.Add(newSub);
    }
    return newArray;
};
"use strict";
Array.prototype.Insert = function (object, index) {
    var that = this;
    that.splice(index, 0, object);
    return that;
};
"use strict";
Array.prototype.Intersect = function (array) {
    var that = this;
    var newArray = [];
    that.ForEach(function (x) {
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
};
"use strict";
Array.prototype.Join = function (char, selector) {
    var that = this;
    var array = [];
    if (selector != null) {
        array = that.Select(selector);
    }
    return array.join(char);
};
"use strict";
Array.prototype.Last = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    }
    else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        }
        else {
            throw new Error("Linq4JS: The Last Entry was not found");
        }
    }
};
"use strict";
Array.prototype.LastOrDefault = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            return null;
        }
    }
    else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        }
        else {
            return null;
        }
    }
};
"use strict";
Array.prototype.Max = function (valueSelector) {
    var that = this;
    if (valueSelector != null) {
        var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
        return that.OrderBy(valueSelectorFunction).LastOrDefault();
    }
    else {
        return that.OrderBy(function (x) { return x; }).LastOrDefault();
    }
};
"use strict";
Array.prototype.Min = function (valueSelector) {
    var that = this;
    if (valueSelector != null) {
        var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
        return that.OrderBy(valueSelectorFunction).FirstOrDefault();
    }
    else {
        return that.OrderBy(function (x) { return x; }).FirstOrDefault();
    }
};
"use strict";
Array.prototype.Move = function (oldIndex, newIndex) {
    var that = this;
    that.splice(newIndex, 0, that.splice(oldIndex, 1)[0]);
    return that;
};
"use strict";
Array.prototype.OrderBy = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = that.Clone();
    ordered.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, false);
    });
};
"use strict";
Array.prototype.OrderByDescending = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = that.Clone();
    ordered.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, true);
    });
};
"use strict";
Array.prototype.Range = function (start, length) {
    var that = this;
    var newArray = [];
    for (var i = start; i < start + length; i++) {
        newArray.Add(that.Get(i));
    }
    return newArray;
};
"use strict";
Array.prototype.Remove = function (object, primaryKeySelector) {
    var that = this;
    var targetIndex;
    if (object == null) {
        throw new Error("Linq4JS: The object cannot be null");
    }
    var castedObject = object;
    if (primaryKeySelector != null) {
        var selector_1 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = that.FindIndex(function (x) {
            return selector_1(x) === selector_1(object);
        });
    }
    else if (castedObject._GeneratedId_ != null) {
        targetIndex = that.FindIndex(function (x) {
            return x._GeneratedId_ === castedObject._GeneratedId_;
        });
    }
    else if (castedObject.Id != null) {
        targetIndex = that.FindIndex(function (x) {
            return x.Id === castedObject.Id;
        });
    }
    else {
        targetIndex = that.FindIndex(function (x) {
            return x === object;
        });
    }
    if (targetIndex !== -1) {
        that.splice(targetIndex, 1);
    }
    else {
        throw new Error("Linq4JS: Nothing found to Remove");
    }
    return that;
};
"use strict";
Array.prototype.RemoveRange = function (objects, primaryKeySelector) {
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
};
"use strict";
Array.prototype.Repeat = function (object, count) {
    var that = this;
    for (var i = 0; i < count; i++) {
        that.Add(object);
    }
    return that;
};
"use strict";
Array.prototype.Reverse = function () {
    var that = this;
    return that.reverse();
};
"use strict";
Array.prototype.Select = function (selector) {
    var that = this;
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
    for (var _i = 0, that_2 = that; _i < that_2.length; _i++) {
        var obj = that_2[_i];
        newArray.Add(selectorFunction(obj));
    }
    return newArray;
};
"use strict";
Array.prototype.SequenceEqual = function (array) {
    var that = this;
    if (that.Count() !== array.Count()) {
        return false;
    }
    for (var i = 0; i < that.length; i++) {
        var keys = Object.keys(that[i]);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (that[i][key] !== array[i][key]) {
                return false;
            }
        }
    }
    return true;
};
"use strict";
Array.prototype.Skip = function (count) {
    var that = this;
    return that.slice(count, that.Count());
};
"use strict";
Array.prototype.Sum = function (selector, filter) {
    var that = this;
    var result = 0;
    var array = [];
    if (filter != null) {
        array = that.Where(filter);
    }
    if (selector != null) {
        array = that.Select(selector);
    }
    array.ForEach(function (x) {
        result += x;
    });
    return result;
};
"use strict";
Array.prototype.Take = function (count) {
    var that = this;
    return that.slice(0, count);
};
"use strict";
Array.prototype.TakeWhile = function (condition, initial, after) {
    var that = this;
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
    for (var _i = 0, that_3 = that; _i < that_3.length; _i++) {
        var object = that_3[_i];
        if (conditionFunction(object, storage) === true) {
            result.Add(object);
            if (afterFunction != null) {
                afterFunction(object, storage);
            }
        }
        else {
            break;
        }
    }
    return result;
};
"use strict";
Array.prototype.ThenBy = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    if (that.Order == null || that.Order.Count() === 0) {
        throw new Error("Linq4JS: Please call OrderBy or OrderByDescending before ThenBy");
    }
    var ordered = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction === Linq4JS.OrderDirection.Descending);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
};
"use strict";
Array.prototype.ThenByDescending = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    if (that.Order == null || that.Order.Count() === 0) {
        throw new Error("Linq4JS: Please call OrderBy or OrderByDescending before ThenByDescending");
    }
    var ordered = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction === Linq4JS.OrderDirection.Descending);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
};
"use strict";
Array.prototype.ToDictionary = function (keySelector, valueSelector) {
    var that = this;
    var keySelectorFunction = Linq4JS.Helper.ConvertFunction(keySelector);
    var returnObject = {};
    if (valueSelector != null) {
        var valueSelectorFunction_2 = Linq4JS.Helper.ConvertFunction(valueSelector);
        that.ForEach(function (x) {
            returnObject[keySelectorFunction(x)] = valueSelectorFunction_2(x);
        });
    }
    else {
        that.ForEach(function (x) {
            returnObject[keySelectorFunction(x)] = x;
        });
    }
    return returnObject;
};
"use strict";
Array.prototype.Union = function (array) {
    var that = this;
    return that.Concat(array).Distinct();
};
"use strict";
Array.prototype.Update = function (object, primaryKeySelector) {
    var that = this;
    var targetIndex;
    if (object == null) {
        throw new Error("Linq4JS: The object cannot be null");
    }
    var castedObject = object;
    if (primaryKeySelector != null) {
        var selector_3 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = that.FindIndex(function (x) {
            return selector_3(x) === selector_3(object);
        });
    }
    else if (castedObject._GeneratedId_ != null) {
        targetIndex = that.FindIndex(function (x) {
            return x._GeneratedId_ === castedObject._GeneratedId_;
        });
    }
    else if (castedObject.Id != null) {
        targetIndex = that.FindIndex(function (x) {
            return x.Id === castedObject.Id;
        });
    }
    else {
        targetIndex = that.FindIndex(function (x) {
            return x === object;
        });
    }
    if (targetIndex !== -1) {
        var keys = Object.keys(object);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            if (key !== "Id") {
                that[targetIndex][key] = object[key];
            }
        }
    }
    else {
        throw new Error("Linq4JS: Nothing found to Update");
    }
    return that;
};
"use strict";
Array.prototype.UpdateRange = function (objects, primaryKeySelector) {
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
    return that;
};
"use strict";
Array.prototype.Where = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        var newArray = [];
        for (var i = 0; i < that.length; i++) {
            var obj = that[i];
            if (filterFunction(obj, i) === true) {
                newArray.push(obj);
            }
        }
        return newArray;
    }
    else {
        throw new Error("Linq4JS: You must define a filter");
    }
};
"use strict";
Array.prototype.Zip = function (array, result) {
    var that = this;
    var resultFunction = Linq4JS.Helper.ConvertFunction(result);
    var newArray = new Array();
    for (var i = 0; i < that.length; i++) {
        if (array[i] != null) {
            newArray.Add(resultFunction(that[i], array[i]));
        }
    }
    return newArray;
};
"use strict";
var Linq4JS;
(function (Linq4JS) {
    var OrderEntry = (function () {
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
"use strict";
var Linq4JS;
(function (Linq4JS) {
    var SelectEntry = (function () {
        function SelectEntry(n, p) {
            this.name = n;
            this.property = p;
        }
        return SelectEntry;
    }());
    Linq4JS.SelectEntry = SelectEntry;
})(Linq4JS || (Linq4JS = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi9FbnRpdHkudHMiLCJkZXYvRXZhbHVhdGVDb21tYW5kLnRzIiwiZGV2L0hlbHBlci50cyIsImRldi9Nb2R1bGVzL0FkZC50cyIsImRldi9Nb2R1bGVzL0FkZFJhbmdlLnRzIiwiZGV2L01vZHVsZXMvQWdncmVnYXRlLnRzIiwiZGV2L01vZHVsZXMvQWxsLnRzIiwiZGV2L01vZHVsZXMvQW55LnRzIiwiZGV2L01vZHVsZXMvQXZlcmFnZS50cyIsImRldi9Nb2R1bGVzL0Nsb25lLnRzIiwiZGV2L01vZHVsZXMvQ29uY2F0LnRzIiwiZGV2L01vZHVsZXMvQ29udGFpbnMudHMiLCJkZXYvTW9kdWxlcy9Db3VudC50cyIsImRldi9Nb2R1bGVzL0Rpc3RpbmN0LnRzIiwiZGV2L01vZHVsZXMvRXZhbHVhdGUudHMiLCJkZXYvTW9kdWxlcy9GaW5kSW5kZXgudHMiLCJkZXYvTW9kdWxlcy9GaW5kTGFzdEluZGV4LnRzIiwiZGV2L01vZHVsZXMvRmlyc3QudHMiLCJkZXYvTW9kdWxlcy9GaXJzdE9yRGVmYXVsdC50cyIsImRldi9Nb2R1bGVzL0ZvckVhY2gudHMiLCJkZXYvTW9kdWxlcy9HZXQudHMiLCJkZXYvTW9kdWxlcy9Hcm91cEJ5LnRzIiwiZGV2L01vZHVsZXMvSW5zZXJ0LnRzIiwiZGV2L01vZHVsZXMvSW50ZXJzZWN0LnRzIiwiZGV2L01vZHVsZXMvSm9pbi50cyIsImRldi9Nb2R1bGVzL0xhc3QudHMiLCJkZXYvTW9kdWxlcy9MYXN0T3JEZWZhdWx0LnRzIiwiZGV2L01vZHVsZXMvTWF4LnRzIiwiZGV2L01vZHVsZXMvTWluLnRzIiwiZGV2L01vZHVsZXMvTW92ZS50cyIsImRldi9Nb2R1bGVzL09yZGVyQnkudHMiLCJkZXYvTW9kdWxlcy9PcmRlckJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1JhbmdlLnRzIiwiZGV2L01vZHVsZXMvUmVtb3ZlLnRzIiwiZGV2L01vZHVsZXMvUmVtb3ZlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9SZXBlYXQudHMiLCJkZXYvTW9kdWxlcy9SZXZlcnNlLnRzIiwiZGV2L01vZHVsZXMvU2VsZWN0LnRzIiwiZGV2L01vZHVsZXMvU2VxdWVuY2VFcXVhbC50cyIsImRldi9Nb2R1bGVzL1NraXAudHMiLCJkZXYvTW9kdWxlcy9TdW0udHMiLCJkZXYvTW9kdWxlcy9UYWtlLnRzIiwiZGV2L01vZHVsZXMvVGFrZVdoaWxlLnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5LnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1RvRGljdGlvbmFyeS50cyIsImRldi9Nb2R1bGVzL1VuaW9uLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9XaGVyZS50cyIsImRldi9Nb2R1bGVzL1ppcC50cyIsImRldi9PcmRlckVudHJ5LnRzIiwiZGV2L1NlbGVjdEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLE9BQU8sQ0FLaEI7QUFMRCxXQUFVLE9BQU87SUFDYjtRQUFBO1FBR0EsQ0FBQztRQUFELHNCQUFDO0lBQUQsQ0FIQSxBQUdDLElBQUE7SUFIWSx1QkFBZSxrQkFHM0IsQ0FBQTtBQUNMLENBQUMsRUFMUyxPQUFPLEtBQVAsT0FBTyxRQUtoQjs7QUNMRCxJQUFVLE9BQU8sQ0F5Q2hCO0FBekNELFdBQVUsT0FBTztJQUNiO1FBS0kseUJBQVksT0FBZTtZQUFFLG9CQUF1QjtpQkFBdkIsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO2dCQUF2QixtQ0FBdUI7O1lBSDdDLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFDMUIsV0FBTSxHQUFhLEVBQUUsQ0FBQztZQUd6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixHQUFHLENBQUMsQ0FBVyxVQUFVLEVBQVYseUJBQVUsRUFBVix3QkFBVSxFQUFWLElBQVU7Z0JBQXBCLElBQUksRUFBRSxtQkFBQTtnQkFDUCxJQUFJ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RyxVQUFVLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUM7UUFDeEMsQ0FBQztRQUNMLGlCQUFDO0lBQUQsQ0FSQSxBQVFDLElBQUE7SUFSWSxrQkFBVSxhQVF0QixDQUFBO0lBRUQsSUFBWSxjQUVYO0lBRkQsV0FBWSxjQUFjO1FBQ3RCLDZEQUFTLENBQUE7UUFBRSwrREFBVSxDQUFBO0lBQ3pCLENBQUMsRUFGVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUV6QjtBQUNMLENBQUMsRUFkUyxPQUFPLEtBQVAsT0FBTyxRQWNoQjs7QUNkRCxJQUFVLE9BQU8sQ0FVaEI7QUFWRCxXQUFVLE9BQU87SUFDYjtRQUlJLHFCQUFZLENBQVMsRUFBRSxDQUFTO1lBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNMLGtCQUFDO0lBQUQsQ0FSQSxBQVFDLElBQUE7SUFSWSxtQkFBVyxjQVF2QixDQUFBO0FBQ0wsQ0FBQyxFQVZTLE9BQU8sS0FBUCxPQUFPLFFBVWhCIiwiZmlsZSI6ImxpbnE0anMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgTGlucTRKUyB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2VuZXJhdGVkRW50aXR5IHtcclxuICAgICAgICBwdWJsaWMgX0dlbmVyYXRlZElkXzogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBJZDogbnVtYmVyO1xyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIEV2YWx1YXRlQ29tbWFuZCB7XHJcbiAgICAgICAgcHVibGljIENvbW1hbmQ6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgU3BsaXRSZWdleDogUmVnRXhwW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgRmluZGVyOiBSZWdFeHBbXSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb21tYW5kOiBzdHJpbmcsIC4uLmlkZW50aWZpZXI6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQ29tbWFuZCA9IGNvbW1hbmQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpZCBvZiBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc1NwbGl0UmVnZXg6IHN0cmluZztcclxuICAgICAgICAgICAgICAgIGxldCBzRmluZGVyOiBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlkLmluZGV4T2YoXCJ7eH1cIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluZGV4T2YoXCJ7eH1cIikgPT09IGlkLmxlbmd0aCAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1NwbGl0UmVnZXggPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fVwiLCBcIlwiKSArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc0ZpbmRlciA9IFwiXFxcXGJcIiArIGlkLnJlcGxhY2UoXCIge3h9XCIsIFwiXFxcXGIgKC4qKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzU3BsaXRSZWdleCA9IFwiXFxcXGJcIiArIGlkLnJlcGxhY2UoXCIge3h9XCIsIFwiXFxcXGIgLio/IFxcXFxiXCIpICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzRmluZGVyID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH0gXCIsIFwiXFxcXGIgKC4qKSBcXFxcYlwiKSArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNTcGxpdFJlZ2V4ID0gXCJcXFxcYlwiICsgaWQgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgc0ZpbmRlciA9IFwiXFxcXGJcIiArIGlkICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuRmluZGVyLnB1c2gobmV3IFJlZ0V4cChzRmluZGVyLCBcImlcIikpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TcGxpdFJlZ2V4LnB1c2gobmV3IFJlZ0V4cChzU3BsaXRSZWdleCwgXCJnaVwiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2YWx1YXRlQ29tbWFuZFJlc3VsdCB7XHJcbiAgICAgICAgcHVibGljIENvbW1hbmQ6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgRHluYW1pY0Z1bmN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNtZDogc3RyaW5nLCBmbjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQ29tbWFuZCA9IGNtZDtcclxuICAgICAgICAgICAgdGhpcy5EeW5hbWljRnVuY3Rpb24gPSBmbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgTGlucTRKUyB7XHJcbiAgICBleHBvcnQgY2xhc3MgSGVscGVyIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBDb252ZXJ0U3RyaW5nRnVuY3Rpb24oZnVuY3Rpb25TdHJpbmc6IHN0cmluZywgbm9BdXRvUmV0dXJuPzogYm9vbGVhbiwgbm9CcmFja2V0UmVwbGFjZT86IGJvb2xlYW4pOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoZnVuY3Rpb25TdHJpbmcubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBDYW5ub3QgY29udmVydCBlbXB0eSBzdHJpbmcgdG8gZnVuY3Rpb25cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB2YXJuYW1lU3RyaW5nOiBzdHJpbmcgPSBmdW5jdGlvblN0cmluZ1xyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygwLCBmdW5jdGlvblN0cmluZy5pbmRleE9mKFwiPT5cIikpXHJcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpLmpvaW4oXCJcIilcclxuICAgICAgICAgICAgICAgIC5zcGxpdChcIihcIikuam9pbihcIlwiKVxyXG4gICAgICAgICAgICAgICAgLnNwbGl0KFwiKVwiKS5qb2luKFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhcm5hbWVzOiBzdHJpbmdbXSA9IHZhcm5hbWVTdHJpbmcuc3BsaXQoXCIsXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGZ1bmM6IHN0cmluZyA9IGZ1bmN0aW9uU3RyaW5nXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGZ1bmN0aW9uU3RyaW5nLmluZGV4T2YoXCI9PlwiKSArIChcIj0+XCIpLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9CcmFja2V0UmVwbGFjZSA9PSBudWxsIHx8IG5vQnJhY2tldFJlcGxhY2UgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jLnJlcGxhY2UoXCJ7XCIsIFwiXCIpLnJlcGxhY2UoXCJ9XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jLnNwbGl0KFwiLm1hdGNoKC8vZ2kpXCIpLmpvaW4oXCJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9BdXRvUmV0dXJuID09IG51bGwgfHwgbm9BdXRvUmV0dXJuID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgLypObyByZXR1cm4gb3V0c2lkZSBvZiBxdW90YXRpb25zKi9cclxuICAgICAgICAgICAgICAgIGlmIChmdW5jLm1hdGNoKC9yZXR1cm4oPz0oW15cXFwiJ10qW1xcXCInXVteXFxcIiddKltcXFwiJ10pKlteXFxcIiddKiQpL2cpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jID0gXCJyZXR1cm4gXCIgKyBmdW5jO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24oLi4udmFybmFtZXMsIGZ1bmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDb252ZXJ0RnVuY3Rpb248VD4odGVzdEZ1bmN0aW9uOiBzdHJpbmcgfCBULCBub0F1dG9SZXR1cm4/OiBib29sZWFuLCBub0JyYWNrZXRSZXBsYWNlPzogYm9vbGVhbik6IFQge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0OiBUO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZXN0RnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGVzdEZ1bmN0aW9uO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0ZXN0RnVuY3Rpb24gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRTdHJpbmdGdW5jdGlvbih0ZXN0RnVuY3Rpb24sIG5vQXV0b1JldHVybiwgbm9CcmFja2V0UmVwbGFjZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExpbnE0SlM6IENhbm5vdCB1c2UgJyR7dGVzdEZ1bmN0aW9ufScgYXMgZnVuY3Rpb25gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgT3JkZXJDb21wYXJlRnVuY3Rpb248VD4odmFsdWVTZWxlY3RvcjogKGl0ZW06IFQpID0+IGFueSwgYTogVCwgYjogVCwgaW52ZXJ0OiBib29sZWFuKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlX2E6IGFueSA9IHZhbHVlU2VsZWN0b3IoYSk7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZV9iOiBhbnkgPSB2YWx1ZVNlbGVjdG9yKGIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHR5cGVfYTogc3RyaW5nID0gdHlwZW9mIHZhbHVlX2E7XHJcbiAgICAgICAgICAgIGxldCB0eXBlX2I6IHN0cmluZyA9IHR5cGVvZiB2YWx1ZV9iO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVfYSA9PT0gXCJzdHJpbmdcIiAmJiB0eXBlX2EgPT09IHR5cGVfYikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2Ffc3RyaW5nOiBzdHJpbmcgPSB2YWx1ZV9hO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVfYV9zdHJpbmcgPSB2YWx1ZV9hX3N0cmluZy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2Jfc3RyaW5nOiBzdHJpbmcgPSB2YWx1ZV9iO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVfYl9zdHJpbmcgPSB2YWx1ZV9iX3N0cmluZy50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZV9hX3N0cmluZyA+IHZhbHVlX2Jfc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA9PT0gdHJ1ZSA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWVfYV9zdHJpbmcgPCB2YWx1ZV9iX3N0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPT09IHRydWUgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlX2EgPT09IFwibnVtYmVyXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9hX251bWJlcjogbnVtYmVyID0gdmFsdWVfYTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9iX251bWJlcjogbnVtYmVyID0gdmFsdWVfYjtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID09PSB0cnVlID8gdmFsdWVfYl9udW1iZXIgLSB2YWx1ZV9hX251bWJlciA6IHZhbHVlX2FfbnVtYmVyIC0gdmFsdWVfYl9udW1iZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9hID09PSBcImJvb2xlYW5cIiAmJiB0eXBlX2EgPT09IHR5cGVfYikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2FfYm9vbDogYm9vbGVhbiA9IHZhbHVlX2E7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYl9ib29sOiBib29sZWFuID0gdmFsdWVfYjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVfYV9ib29sID09PSB2YWx1ZV9iX2Jvb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludmVydCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVfYV9ib29sID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZV9hX2Jvb2wgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVfYSA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlX2EgPT09IHR5cGVfYikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlX2EgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlX2IgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFNwbGl0Q29tbWFuZChjb21tYW5kOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGxldCBzcGxpdEluZGV4ZXM6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBjbWQgb2YgdGhpcy5Db21tYW5kcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc3BsaXQgb2YgY21kLlNwbGl0UmVnZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHNwbGl0LmV4ZWMoY29tbWFuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXRJbmRleGVzLnB1c2gocmVzdWx0LmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFydHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgICAgICBzcGxpdEluZGV4ZXMgPSBzcGxpdEluZGV4ZXMuRGlzdGluY3QoKS5PcmRlckJ5KHggPT4geCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0SW5kZXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNwbGl0SW5kZXhlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChjb21tYW5kLnN1YnN0cihzcGxpdEluZGV4ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChjb21tYW5kLnN1YnN0cihzcGxpdEluZGV4ZXNbaV0sIHNwbGl0SW5kZXhlc1tpICsgMV0gLSBzcGxpdEluZGV4ZXNbaV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBNYXRjaENvbW1hbmQoY21kOiBzdHJpbmcpOiBFdmFsdWF0ZUNvbW1hbmRSZXN1bHQge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY29tbWFuZCBvZiB0aGlzLkNvbW1hbmRzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcmVnZXggb2YgY29tbWFuZC5GaW5kZXIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBjbWQubWF0Y2gocmVnZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFdmFsdWF0ZUNvbW1hbmRSZXN1bHQoY29tbWFuZC5Db21tYW5kLCByZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTGlucTRKUzogTm8gbWF0Y2hpbmcgY29tbWFuZCB3YXMgZm91bmQgZm9yICcke2NtZH0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENvbW1hbmRzOiBFdmFsdWF0ZUNvbW1hbmRbXSA9IFtcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkNsb25lXCIsIFwiY2xvbmVcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJSZXZlcnNlXCIsIFwicmV2ZXJzZVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIldoZXJlXCIsIFwid2hlcmUge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2VsZWN0XCIsIFwic2VsZWN0IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkdldFwiLCBcImdldCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJGb3JFYWNoXCIsIFwiZm9yZWFjaCB7eH1cIiwgXCJmb3IgZWFjaCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJDb3VudFwiLCBcImNvdW50XCIsIFwiY291bnQge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiQWxsXCIsIFwiYWxsIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkFueVwiLCBcImFueSB7eH1cIiwgXCJhbnlcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJUYWtlXCIsIFwidGFrZSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJTa2lwXCIsIFwic2tpcCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJNaW5cIiwgXCJtaW4ge3h9XCIsIFwibWluXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiTWF4XCIsIFwibWF4IHt4fVwiLCBcIm1heFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkdyb3VwQnlcIiwgXCJncm91cGJ5IHt4fVwiLCBcImdyb3VwIGJ5IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkRpc3RpbmN0XCIsIFwiZGlzdGluY3Qge3h9XCIsIFwiZGlzdGluY3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJGaW5kTGFzdEluZGV4XCIsIFwiZmluZGxhc3RpbmRleCB7eH1cIiwgXCJmaW5kIGxhc3QgaW5kZXgge3h9XCIsIFwiZmluZGluZGV4IHt4fSBsYXN0XCIsIFwiZmluZCBpbmRleCB7eH0gbGFzdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpbmRJbmRleFwiLCBcImZpbmRmaXJzdGluZGV4IHt4fVwiLCBcImZpbmQgZmlyc3QgaW5kZXgge3h9XCIsIFwiZmluZGluZGV4IHt4fSBmaXJzdFwiLCBcImZpbmQgaW5kZXgge3h9IGZpcnN0XCIsIFwiZmluZGluZGV4IHt4fVwiLCBcImZpbmQgaW5kZXgge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiT3JkZXJCeURlc2NlbmRpbmdcIiwgXCJvcmRlcmJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwib3JkZXIgYnkge3h9IGRlc2NlbmRpbmdcIiwgXCJvcmRlcmJ5IGRlc2NlbmRpbmcge3h9XCIsIFwib3JkZXJieWRlc2NlbmRpbmcge3h9XCIsIFwib3JkZXIgYnkgZGVzY2VuZGluZyB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJPcmRlckJ5XCIsIFwib3JkZXJieSB7eH0gYXNjZW5kaW5nXCIsIFwib3JkZXIgYnkge3h9IGFzY2VuZGluZ1wiLCBcIm9yZGVyYnlhc2NlbmRpbmcge3h9XCIsIFwib3JkZXIgYnkgYXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyYnkge3h9XCIsIFwib3JkZXIgYnkge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmlyc3RPckRlZmF1bHRcIiwgXCJmaXJzdG9yZGVmYXVsdCB7eH1cIiwgXCJmaXJzdCBvciBkZWZhdWx0IHt4fVwiLCBcImZpcnN0b3JkZWZhdWx0XCIsIFwiZmlyc3Qgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkxhc3RPckRlZmF1bHRcIiwgXCJsYXN0b3JkZWZhdWx0IHt4fVwiLCBcImxhc3Qgb3IgZGVmYXVsdCB7eH1cIiwgXCJsYXN0b3JkZWZhdWx0XCIsIFwibGFzdCBvciBkZWZhdWx0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmlyc3RcIiwgXCJmaXJzdCB7eH1cIiwgXCJmaXJzdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkxhc3RcIiwgXCJsYXN0IHt4fVwiLCBcImxhc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJUaGVuQnlEZXNjZW5kaW5nXCIsIFwidGhlbmJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwidGhlbiBieSB7eH0gZGVzY2VuZGluZ1wiLCBcInRoZW5ieWRlc2NlbmRpbmcge3h9XCIsIFwidGhlbiBieSBkZXNjZW5kaW5nIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlRoZW5CeVwiLCBcInRoZW5ieSB7eH0gYXNjZW5kaW5nXCIsIFwidGhlbiBieSB7eH0gYXNjZW5kaW5nXCIsIFwidGhlbmJ5YXNjZW5kaW5nIHt4fVwiLCBcInRoZW4gYnkgYXNjZW5kaW5nIHt4fVwiLCBcInRoZW5ieSB7eH1cIiwgXCJ0aGVuIGJ5IHt4fVwiKVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn0iLCJBcnJheS5wcm90b3R5cGUuQWRkID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBnZW5lcmF0ZUlkPzogYm9vbGVhbik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAob2JqZWN0ICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZ2VuZXJhdGVJZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBsZXQgbmV3SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuICAgICAgICAgICAgbGV0IGxhc3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gdGhhdC5XaGVyZSgoeDogYW55KSA9PiB4Ll9HZW5lcmF0ZWRJZF8gIT0gbnVsbCkuT3JkZXJCeSgoeDogYW55KSA9PiB4Ll9HZW5lcmF0ZWRJZF8pLkxhc3RPckRlZmF1bHQoKSBhcyBhbnk7XHJcbiAgICAgICAgICAgIGlmIChsYXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbGFzdC5fR2VuZXJhdGVkSWRfICE9IG51bGwgPyBsYXN0Ll9HZW5lcmF0ZWRJZF8gOiAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGF0LkFueShmdW5jdGlvbih4OiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHggYXMgTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkpLl9HZW5lcmF0ZWRJZF8gPT09IG5ld0luZGV4O1xyXG4gICAgICAgICAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXyA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoYXQucHVzaChvYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5BZGRSYW5nZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdHM6IFRbXSwgZ2VuZXJhdGVJZDogYm9vbGVhbik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBvYmplY3RzLkZvckVhY2goZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICB0aGF0LkFkZCh4LCBnZW5lcmF0ZUlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5BZ2dyZWdhdGUgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBtZXRob2Q6ICgocmVzdWx0OiBhbnksIGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIHN0YXJ0VmFsPzogYW55KTogc3RyaW5nIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCByZXN1bHQ6IGFueTtcclxuXHJcbiAgICBpZiAoc3RhcnRWYWwgIT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHN0YXJ0VmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtZXRob2RGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwocmVzdWx0OiBhbnksIGl0ZW06IFQpID0+IGFueT4obWV0aG9kKTtcclxuXHJcbiAgICB0aGF0LkZvckVhY2goZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmVzdWx0ID0gbWV0aG9kRnVuY3Rpb24ocmVzdWx0LCB4KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkFsbCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcjogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRoYXQuQ291bnQoZmlsdGVyKSA9PT0gdGhhdC5Db3VudCgpO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5BbnkgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdC5Db3VudChmaWx0ZXIpID4gMDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuQXZlcmFnZSA9IGZ1bmN0aW9uIDxUPih0aGlzOiBUW10sIHNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCByZXN1bHQ6IG51bWJlciA9IDA7XHJcbiAgICBsZXQgYXJyYXk6IGFueVtdID0gdGhhdDtcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IGFycmF5LldoZXJlKGZpbHRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IGFycmF5LlNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgYXJyYXkuRm9yRWFjaChmdW5jdGlvbih4KXtcclxuICAgICAgICByZXN1bHQgKz0geDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQgLyBhcnJheS5Db3VudCgpO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5DbG9uZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10pOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IG5ld0FycmF5OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmogb2YgdGhhdCkge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuQ29uY2F0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuICAgIHRoYXQgPSB0aGF0LmNvbmNhdChhcnJheSk7XHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuQ29udGFpbnMgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQpOiBib29sZWFuIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiB0aGF0LkFueShmdW5jdGlvbih4KXtcclxuICAgICAgICByZXR1cm4geCA9PT0gb2JqZWN0O1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkNvdW50ID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gdGhhdC5XaGVyZShmaWx0ZXIpLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoYXQubGVuZ3RoO1xyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5EaXN0aW5jdCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHZhbHVlU2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGF0LldoZXJlKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkZpbmRJbmRleCh5ID0+IHZhbHVlU2VsZWN0b3JGdW5jdGlvbih5KSA9PT0gdmFsdWVTZWxlY3RvckZ1bmN0aW9uKHgpKSA9PT0gaTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoYXQuV2hlcmUoKHgsIGkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuRmluZEluZGV4KHkgPT4geSA9PT0geCkgPT09IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkV2YWx1YXRlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY29tbWFuZDogc3RyaW5nKTogYW55IHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBjb21tYW5kUGFydHM6IHN0cmluZ1tdID0gTGlucTRKUy5IZWxwZXIuU3BsaXRDb21tYW5kKGNvbW1hbmQpO1xyXG5cclxuICAgIGxldCBjb21wdXRlT2JqZWN0OiBhbnkgPSB0aGF0O1xyXG5cclxuICAgIGZvciAobGV0IGNtZCBvZiBjb21tYW5kUGFydHMpIHtcclxuICAgICAgICBsZXQgY21kUmVzdWx0ID0gTGlucTRKUy5IZWxwZXIuTWF0Y2hDb21tYW5kKGNtZCk7XHJcblxyXG4gICAgICAgIGNvbXB1dGVPYmplY3QgPSBjb21wdXRlT2JqZWN0W2NtZFJlc3VsdC5Db21tYW5kXShjbWRSZXN1bHQuRHluYW1pY0Z1bmN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY29tcHV0ZU9iamVjdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuRmluZEluZGV4ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYm9vbGVhbj4oZmlsdGVyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGF0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBvYmo6IFQgPSB0aGF0W2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpbHRlckZ1bmN0aW9uKG9iaikgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFlvdSBtdXN0IGRlZmluZSBhIGZpbHRlclwiKTtcclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuRmluZExhc3RJbmRleCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcjogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgZmlsdGVyRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGJvb2xlYW4+KGZpbHRlcik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGF0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGxldCBvYmo6IFQgPSB0aGF0W2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpbHRlckZ1bmN0aW9uKG9iaikgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFlvdSBtdXN0IGRlZmluZSBhIGZpbHRlclwiKTtcclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuRmlyc3QgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVCB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUW10gPSB0aGF0LldoZXJlKGZpbHRlcik7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIEZpcnN0IEVudHJ5IHdhcyBub3QgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhhdC5BbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5HZXQoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIEZpcnN0IEVudHJ5IHdhcyBub3QgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5GaXJzdE9yRGVmYXVsdCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoYXQuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGF0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkZvckVhY2ggPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhY3Rpb246ICgoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4gfCBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBhY3Rpb25GdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4gfCBhbnk+KGFjdGlvbiwgdHJ1ZSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGF0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGFjdGlvbkZ1bmN0aW9uKHRoYXRbaV0sIGkpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuR2V0ID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgaW5kZXg6IG51bWJlcik6IFQge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRoYXRbaW5kZXhdO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Hcm91cEJ5ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgc2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXVtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBzZWxlY3RvckZ1bmN0aW9uOiAoaXRlbTogVCkgPT4gYW55ID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHNlbGVjdG9yKTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXVtdID0gW107XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoYXQuT3JkZXJCeShzZWxlY3RvckZ1bmN0aW9uKTtcclxuXHJcbiAgICBsZXQgcHJldjogVDtcclxuICAgIGxldCBuZXdTdWI6IFRbXSA9IFtdO1xyXG5cclxuICAgIG9yZGVyZWQuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAocHJldiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RvckZ1bmN0aW9uKHByZXYpICE9PSBzZWxlY3RvckZ1bmN0aW9uKHgpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5BZGQobmV3U3ViKTtcclxuICAgICAgICAgICAgICAgIG5ld1N1YiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbmV3U3ViLkdyb3VwVmFsdWUgPSBzZWxlY3RvckZ1bmN0aW9uKHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3U3ViLkdyb3VwVmFsdWUgPSBzZWxlY3RvckZ1bmN0aW9uKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3U3ViLkFkZCh4KTtcclxuICAgICAgICBwcmV2ID0geDtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChuZXdTdWIuQ291bnQoKSA+IDApIHtcclxuICAgICAgICBuZXdBcnJheS5BZGQobmV3U3ViKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkluc2VydCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdDogVCwgaW5kZXg6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICB0aGF0LnNwbGljZShpbmRleCwgMCwgb2JqZWN0KTtcclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuSW50ZXJzZWN0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgIHRoYXQuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAoYXJyYXkuQ29udGFpbnMoeCkpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkuQWRkKHgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFycmF5LkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgaWYgKHRoYXQuQ29udGFpbnMoeCkpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkuQWRkKHgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBuZXdBcnJheS5EaXN0aW5jdCgpO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Kb2luID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgY2hhcjogc3RyaW5nLCBzZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgYXJyYXk6IGFueVtdID0gW107XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IHRoYXQuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyYXkuam9pbihjaGFyKTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuTGFzdCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBUIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoYXQuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkdldChyZXN1bHQubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIExhc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGF0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkdldCh0aGF0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBMYXN0IEVudHJ5IHdhcyBub3QgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5MYXN0T3JEZWZhdWx0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVFtdID0gdGhhdC5XaGVyZShmaWx0ZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuR2V0KHJlc3VsdC5sZW5ndGggLSAxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGF0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkdldCh0aGF0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuTWF4ID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgdmFsdWVTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHZhbHVlU2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIHRoYXQuT3JkZXJCeSh2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pLkxhc3RPckRlZmF1bHQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoYXQuT3JkZXJCeSh4ID0+IHgpLkxhc3RPckRlZmF1bHQoKTtcclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuTWluID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgdmFsdWVTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHZhbHVlU2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGF0Lk9yZGVyQnkodmFsdWVTZWxlY3RvckZ1bmN0aW9uKS5GaXJzdE9yRGVmYXVsdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhhdC5PcmRlckJ5KHggPT4geCkuRmlyc3RPckRlZmF1bHQoKTtcclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuTW92ZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9sZEluZGV4OiBudW1iZXIsIG5ld0luZGV4OiBudW1iZXIpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgdGhhdC5zcGxpY2UobmV3SW5kZXgsIDAsIHRoYXQuc3BsaWNlKG9sZEluZGV4LCAxKVswXSk7XHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuT3JkZXJCeSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGF0LkNsb25lKCk7XHJcbiAgICBvcmRlcmVkLk9yZGVyID0gbmV3IEFycmF5PExpbnE0SlMuT3JkZXJFbnRyeT4obmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkFzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBMaW5xNEpTLkhlbHBlci5PcmRlckNvbXBhcmVGdW5jdGlvbih2YWx1ZVNlbGVjdG9yRnVuY3Rpb24sIGEsIGIsIGZhbHNlKTtcclxuICAgIH0pO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5PcmRlckJ5RGVzY2VuZGluZyA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGF0LkNsb25lKCk7XHJcbiAgICBvcmRlcmVkLk9yZGVyID0gbmV3IEFycmF5PExpbnE0SlMuT3JkZXJFbnRyeT4obmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkRlc2NlbmRpbmcsIHZhbHVlU2VsZWN0b3JGdW5jdGlvbikpO1xyXG5cclxuICAgIHJldHVybiBvcmRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gTGlucTRKUy5IZWxwZXIuT3JkZXJDb21wYXJlRnVuY3Rpb24odmFsdWVTZWxlY3RvckZ1bmN0aW9uLCBhLCBiLCB0cnVlKTtcclxuICAgIH0pO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5SYW5nZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHN0YXJ0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgc3RhcnQgKyBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZCh0aGF0LkdldChpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5SZW1vdmUgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgb2JqZWN0IGNhbm5vdCBiZSBudWxsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXN0ZWRPYmplY3Q6IExpbnE0SlMuR2VuZXJhdGVkRW50aXR5ID0gb2JqZWN0IGFzIGFueTtcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3IoeCkgPT09IHNlbGVjdG9yKG9iamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoYXQuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5fR2VuZXJhdGVkSWRfID09PSBjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXztcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0LklkICE9IG51bGwpIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoYXQuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh4IGFzIExpbnE0SlMuR2VuZXJhdGVkRW50aXR5KS5JZCA9PT0gY2FzdGVkT2JqZWN0LklkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoYXQuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIHRoYXQuc3BsaWNlKHRhcmdldEluZGV4LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogTm90aGluZyBmb3VuZCB0byBSZW1vdmVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlJlbW92ZVJhbmdlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0czogVFtdLCBwcmltYXJ5S2V5U2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHByaW1hcnlLZXlTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHByaW1hcnlLZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICB0aGF0LlJlbW92ZSh4LCBzZWxlY3Rvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICB0aGF0LlJlbW92ZSh4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuUmVwZWF0ID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgb2JqZWN0OiBULCBjb3VudDogbnVtYmVyKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIHRoYXQuQWRkKG9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlJldmVyc2UgPSBmdW5jdGlvbiA8VD4odGhpczogVFtdKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG4gICAgcmV0dXJuIHRoYXQucmV2ZXJzZSgpO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5TZWxlY3QgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBzZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogYW55W10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHNlbGVjdG9yV29yazogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nID0gc2VsZWN0b3I7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvcldvcmsgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBsZXQgc2VsZWN0U3RhdGVtZW50ID0gc2VsZWN0b3JXb3JrLnN1YnN0cihzZWxlY3RvcldvcmsuaW5kZXhPZihcIj0+XCIpICsgKFwiPT5cIikubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdFN0YXRlbWVudC5tYXRjaCgvXlxccyp7Lip9XFxzKiQvKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdFN0YXRlbWVudCA9IHNlbGVjdFN0YXRlbWVudC5yZXBsYWNlKC9eXFxzKnsoLiopfVxccyokLywgXCIkMVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IHNlbGVjdFN0YXRlbWVudC5zcGxpdCgvLCg/PSg/OlteJ1wiXSpbJ1wiXVteJ1wiXSpbJ1wiXSkqW14nXCJdKiQpL2cpO1xyXG4gICAgICAgICAgICBsZXQgbmV3Q29udGVudCA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0LmluZGV4T2YoXCI6XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gcGFydDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdDb250ZW50ICs9IHBhcnQucmVwbGFjZShcIj1cIiwgXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gcGFydC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gbmFtZSArIFwiOlwiICsgcGFydDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHBhcnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdDb250ZW50ICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RvcldvcmsgPSBzZWxlY3Rvcldvcmsuc3Vic3RyKDAsIHNlbGVjdG9yV29yay5pbmRleE9mKFwiPT5cIikpICsgXCI9PiByZXR1cm4ge1wiICsgbmV3Q29udGVudCArIFwifVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihzZWxlY3RvcldvcmssIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IGFueVtdID0gbmV3IEFycmF5KCk7XHJcblxyXG4gICAgZm9yIChsZXQgb2JqIG9mIHRoYXQpIHtcclxuICAgICAgICBuZXdBcnJheS5BZGQoc2VsZWN0b3JGdW5jdGlvbihvYmopKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlNlcXVlbmNlRXF1YWwgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAodGhhdC5Db3VudCgpICE9PSBhcnJheS5Db3VudCgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhhdFtpXSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBrZXlzKXtcclxuICAgICAgICAgICAgaWYgKCh0aGF0W2ldIGFzIGFueSlba2V5XSAhPT0gKGFycmF5W2ldIGFzIGFueSlba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Ta2lwID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdC5zbGljZShjb3VudCwgdGhhdC5Db3VudCgpKTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuU3VtID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGxldCBhcnJheTogYW55W10gPSBbXTtcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IHRoYXQuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gdGhhdC5TZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmF5LkZvckVhY2goZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmVzdWx0ICs9IHg7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5UYWtlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdC5zbGljZSgwLCBjb3VudCk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRha2VXaGlsZSA9IGZ1bmN0aW9uPFQ+IChcclxuICAgIHRoaXM6IFRbXSxcclxuICAgIGNvbmRpdGlvbjogKChpdGVtOiBULCBzdG9yYWdlPzogYW55KSA9PiBib29sZWFuKSB8IHN0cmluZyxcclxuICAgIGluaXRpYWw/OiAoKHN0b3JhZ2U6IGFueSkgPT4gdm9pZCkgfCBzdHJpbmcsXHJcbiAgICBhZnRlcj86ICgoaXRlbTogVCwgc3RvcmFnZTogYW55KSA9PiB2b2lkKSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgY29uZGl0aW9uRnVuY3Rpb246IChpdGVtOiBULCBzdG9yYWdlPzogYW55KSA9PiBib29sZWFuID1cclxuICAgICAgICBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4+KGNvbmRpdGlvbik7XHJcblxyXG4gICAgbGV0IHN0b3JhZ2U6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmIChpbml0aWFsICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgaW5pdGlhbEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGluaXRpYWwpO1xyXG4gICAgICAgIGluaXRpYWxGdW5jdGlvbihzdG9yYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYWZ0ZXJGdW5jdGlvbjogKChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKGFmdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhZnRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGFmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmplY3Qgb2YgdGhhdCl7XHJcbiAgICAgICAgaWYgKGNvbmRpdGlvbkZ1bmN0aW9uKG9iamVjdCwgc3RvcmFnZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmVzdWx0LkFkZChvYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFmdGVyRnVuY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXJGdW5jdGlvbihvYmplY3QsIHN0b3JhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRoZW5CeSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGF0Lk9yZGVyID09IG51bGwgfHwgdGhhdC5PcmRlci5Db3VudCgpID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogUGxlYXNlIGNhbGwgT3JkZXJCeSBvciBPcmRlckJ5RGVzY2VuZGluZyBiZWZvcmUgVGhlbkJ5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGF0O1xyXG4gICAgb3JkZXJlZC5PcmRlci5BZGQobmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkFzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBvcmRlcmVkLk9yZGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKGVudHJ5LlZhbHVlU2VsZWN0b3IsIGEsIGIsIGVudHJ5LkRpcmVjdGlvbiA9PT0gTGlucTRKUy5PcmRlckRpcmVjdGlvbi5EZXNjZW5kaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRoZW5CeURlc2NlbmRpbmcgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhhdC5PcmRlciA9PSBudWxsIHx8IHRoYXQuT3JkZXIuQ291bnQoKSA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFBsZWFzZSBjYWxsIE9yZGVyQnkgb3IgT3JkZXJCeURlc2NlbmRpbmcgYmVmb3JlIFRoZW5CeURlc2NlbmRpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoYXQ7XHJcbiAgICBvcmRlcmVkLk9yZGVyLkFkZChuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uRGVzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBvcmRlcmVkLk9yZGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKGVudHJ5LlZhbHVlU2VsZWN0b3IsIGEsIGIsIGVudHJ5LkRpcmVjdGlvbiA9PT0gTGlucTRKUy5PcmRlckRpcmVjdGlvbi5EZXNjZW5kaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRvRGljdGlvbmFyeSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGtleVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IGtleVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4oa2V5U2VsZWN0b3IpO1xyXG5cclxuICAgIGxldCByZXR1cm5PYmplY3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmICh2YWx1ZVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB0aGF0LkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybk9iamVjdFtrZXlTZWxlY3RvckZ1bmN0aW9uKHgpXSA9IHZhbHVlU2VsZWN0b3JGdW5jdGlvbih4KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhhdC5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICByZXR1cm5PYmplY3Rba2V5U2VsZWN0b3JGdW5jdGlvbih4KV0gPSB4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXR1cm5PYmplY3Q7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlVuaW9uID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuICAgIHJldHVybiB0aGF0LkNvbmNhdChhcnJheSkuRGlzdGluY3QoKTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuVXBkYXRlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBwcmltYXJ5S2V5U2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHRhcmdldEluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIG9iamVjdCBjYW5ub3QgYmUgbnVsbFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2FzdGVkT2JqZWN0OiBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSA9IG9iamVjdCBhcyBhbnk7XHJcblxyXG4gICAgaWYgKHByaW1hcnlLZXlTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHByaW1hcnlLZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhhdC5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yKHgpID09PSBzZWxlY3RvcihvYmplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXyAhPSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuX0dlbmVyYXRlZElkXyA9PT0gY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF87XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5JZCAhPSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuSWQgPT09IGNhc3RlZE9iamVjdC5JZDtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4geCA9PT0gb2JqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBsZXQga2V5czogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhvYmplY3QpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSBcIklkXCIpIHtcclxuICAgICAgICAgICAgICAgICh0aGF0W3RhcmdldEluZGV4XSBhcyBhbnkpW2tleV0gPSAob2JqZWN0IGFzIGFueSlba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogTm90aGluZyBmb3VuZCB0byBVcGRhdGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlVwZGF0ZVJhbmdlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0czogVFtdLCBwcmltYXJ5S2V5U2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHByaW1hcnlLZXlTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHByaW1hcnlLZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICB0aGF0LlVwZGF0ZSh4LCBzZWxlY3Rvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICB0aGF0LlVwZGF0ZSh4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuV2hlcmUgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4+KGZpbHRlcik7XHJcblxyXG4gICAgICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBUID0gdGhhdFtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihvYmosIGkpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG5cclxufTsiLCJBcnJheS5wcm90b3R5cGUuWmlwID0gZnVuY3Rpb248VCwgWD4gKHRoaXM6IFRbXSwgYXJyYXk6IFhbXSwgcmVzdWx0OiAoKGZpcnN0OiBULCBzZWNvbmQ6IFgpID0+IGFueSkgfCBzdHJpbmcpOiBhbnlbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgcmVzdWx0RnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGZpcnN0OiBULCBzZWNvbmQ6IFgpID0+IGFueT4ocmVzdWx0KTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXkgPSBuZXcgQXJyYXk8YW55PigpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChhcnJheVtpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG5ld0FycmF5LkFkZChyZXN1bHRGdW5jdGlvbih0aGF0W2ldLCBhcnJheVtpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn07IiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIE9yZGVyRW50cnkge1xyXG4gICAgICAgIHB1YmxpYyBEaXJlY3Rpb246IE9yZGVyRGlyZWN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWYWx1ZVNlbGVjdG9yOiAoaXRlbTogYW55KSA9PiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKF9kaXJlY3Rpb246IE9yZGVyRGlyZWN0aW9uLCBfdmFsdWVTZWxlY3RvcjogKGl0ZW06IGFueSkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuRGlyZWN0aW9uID0gX2RpcmVjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5WYWx1ZVNlbGVjdG9yID0gX3ZhbHVlU2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBlbnVtIE9yZGVyRGlyZWN0aW9uIHtcclxuICAgICAgICBBc2NlbmRpbmcsIERlc2NlbmRpbmdcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RFbnRyeSB7XHJcbiAgICAgICAgcHVibGljIHByb3BlcnR5OiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Iobjogc3RyaW5nLCBwOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gbjtcclxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
