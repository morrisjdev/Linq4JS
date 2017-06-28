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
        new Linq4JS.EvaluateCommand("SingleOrDefault", "singleordefault {x}", "single or default {x}", "singleordefault", "single or default"),
        new Linq4JS.EvaluateCommand("First", "first {x}", "first"),
        new Linq4JS.EvaluateCommand("Last", "last {x}", "last"),
        new Linq4JS.EvaluateCommand("Single", "single {x}", "single"),
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
    var array = that;
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
Array.prototype.Single = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Count() === 1) {
            return result.Get(0);
        }
        else {
            throw new Error("Linq4JS: The array does not contain exactly one element");
        }
    }
    else {
        if (that.Count() === 1) {
            return that.Get(0);
        }
        else {
            throw new Error("Linq4JS: The array does not contain exactly one element");
        }
    }
};
"use strict";
Array.prototype.SingleOrDefault = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
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
        if (that.Count() === 1) {
            return that.Get(0);
        }
        else {
            if (that.Count() > 1) {
                throw new Error("Linq4JS: The array contains more than one element");
            }
            else {
                return null;
            }
        }
    }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi9FbnRpdHkudHMiLCJkZXYvRXZhbHVhdGVDb21tYW5kLnRzIiwiZGV2L0hlbHBlci50cyIsImRldi9Nb2R1bGVzL0FkZC50cyIsImRldi9Nb2R1bGVzL0FkZFJhbmdlLnRzIiwiZGV2L01vZHVsZXMvQWdncmVnYXRlLnRzIiwiZGV2L01vZHVsZXMvQWxsLnRzIiwiZGV2L01vZHVsZXMvQW55LnRzIiwiZGV2L01vZHVsZXMvQXZlcmFnZS50cyIsImRldi9Nb2R1bGVzL0Nsb25lLnRzIiwiZGV2L01vZHVsZXMvQ29uY2F0LnRzIiwiZGV2L01vZHVsZXMvQ29udGFpbnMudHMiLCJkZXYvTW9kdWxlcy9Db3VudC50cyIsImRldi9Nb2R1bGVzL0Rpc3RpbmN0LnRzIiwiZGV2L01vZHVsZXMvRXZhbHVhdGUudHMiLCJkZXYvTW9kdWxlcy9GaW5kSW5kZXgudHMiLCJkZXYvTW9kdWxlcy9GaW5kTGFzdEluZGV4LnRzIiwiZGV2L01vZHVsZXMvRmlyc3QudHMiLCJkZXYvTW9kdWxlcy9GaXJzdE9yRGVmYXVsdC50cyIsImRldi9Nb2R1bGVzL0ZvckVhY2gudHMiLCJkZXYvTW9kdWxlcy9HZXQudHMiLCJkZXYvTW9kdWxlcy9Hcm91cEJ5LnRzIiwiZGV2L01vZHVsZXMvSW5zZXJ0LnRzIiwiZGV2L01vZHVsZXMvSW50ZXJzZWN0LnRzIiwiZGV2L01vZHVsZXMvSm9pbi50cyIsImRldi9Nb2R1bGVzL0xhc3QudHMiLCJkZXYvTW9kdWxlcy9MYXN0T3JEZWZhdWx0LnRzIiwiZGV2L01vZHVsZXMvTWF4LnRzIiwiZGV2L01vZHVsZXMvTWluLnRzIiwiZGV2L01vZHVsZXMvTW92ZS50cyIsImRldi9Nb2R1bGVzL09yZGVyQnkudHMiLCJkZXYvTW9kdWxlcy9PcmRlckJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1JhbmdlLnRzIiwiZGV2L01vZHVsZXMvUmVtb3ZlLnRzIiwiZGV2L01vZHVsZXMvUmVtb3ZlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9SZXBlYXQudHMiLCJkZXYvTW9kdWxlcy9SZXZlcnNlLnRzIiwiZGV2L01vZHVsZXMvU2VsZWN0LnRzIiwiZGV2L01vZHVsZXMvU2VxdWVuY2VFcXVhbC50cyIsImRldi9Nb2R1bGVzL1NpbmdsZS50cyIsImRldi9Nb2R1bGVzL1NpbmdsZU9yRGVmYXVsdC50cyIsImRldi9Nb2R1bGVzL1NraXAudHMiLCJkZXYvTW9kdWxlcy9TdW0udHMiLCJkZXYvTW9kdWxlcy9UYWtlLnRzIiwiZGV2L01vZHVsZXMvVGFrZVdoaWxlLnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5LnRzIiwiZGV2L01vZHVsZXMvVGhlbkJ5RGVzY2VuZGluZy50cyIsImRldi9Nb2R1bGVzL1RvRGljdGlvbmFyeS50cyIsImRldi9Nb2R1bGVzL1VuaW9uLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlLnRzIiwiZGV2L01vZHVsZXMvVXBkYXRlUmFuZ2UudHMiLCJkZXYvTW9kdWxlcy9XaGVyZS50cyIsImRldi9Nb2R1bGVzL1ppcC50cyIsImRldi9PcmRlckVudHJ5LnRzIiwiZGV2L1NlbGVjdEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLE9BQU8sQ0FLaEI7QUFMRCxXQUFVLE9BQU87SUFDYjtRQUFBO1FBR0EsQ0FBQztRQUFELHNCQUFDO0lBQUQsQ0FIQSxBQUdDLElBQUE7SUFIWSx1QkFBZSxrQkFHM0IsQ0FBQTtBQUNMLENBQUMsRUFMUyxPQUFPLEtBQVAsT0FBTyxRQUtoQjs7QUNMRCxJQUFVLE9BQU8sQ0F5Q2hCO0FBekNELFdBQVUsT0FBTztJQUNiO1FBS0kseUJBQVksT0FBZTtZQUFFLG9CQUF1QjtpQkFBdkIsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO2dCQUF2QixtQ0FBdUI7O1lBSDdDLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFDMUIsV0FBTSxHQUFhLEVBQUUsQ0FBQztZQUd6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixHQUFHLENBQUMsQ0FBVyxVQUFVLEVBQVYseUJB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O1FBQ3hDLENBQUM7UUFDTCxpQkFBQztJQUFELENBUkEsQUFRQyxJQUFBO0lBUlksa0JBQVUsYUFRdEIsQ0FBQTtJQUVELElBQVksY0FFWDtJQUZELFdBQVksY0FBYztRQUN0Qiw2REFBUyxDQUFBO1FBQUUsK0RBQVUsQ0FBQTtJQUN6QixDQUFDLEVBRlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFFekI7QUFDTCxDQUFDLEVBZFMsT0FBTyxLQUFQLE9BQU8sUUFjaEI7O0FDZEQsSUFBVSxPQUFPLENBVWhCO0FBVkQsV0FBVSxPQUFPO0lBQ2I7UUFJSSxxQkFBWSxDQUFTLEVBQUUsQ0FBUztZQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7UUFDTCxrQkFBQztJQUFELENBUkEsQUFRQyxJQUFBO0lBUlksbUJBQVcsY0FRdkIsQ0FBQTtBQUNMLENBQUMsRUFWUyxPQUFPLEtBQVAsT0FBTyxRQVVoQiIsImZpbGUiOiJsaW5xNGpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIEdlbmVyYXRlZEVudGl0eSB7XHJcbiAgICAgICAgcHVibGljIF9HZW5lcmF0ZWRJZF86IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgSWQ6IG51bWJlcjtcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBFdmFsdWF0ZUNvbW1hbmQge1xyXG4gICAgICAgIHB1YmxpYyBDb21tYW5kOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIFNwbGl0UmVnZXg6IFJlZ0V4cFtdID0gW107XHJcbiAgICAgICAgcHVibGljIEZpbmRlcjogUmVnRXhwW10gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29tbWFuZDogc3RyaW5nLCAuLi5pZGVudGlmaWVyOiBzdHJpbmdbXSkge1xyXG4gICAgICAgICAgICB0aGlzLkNvbW1hbmQgPSBjb21tYW5kO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaWQgb2YgaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNTcGxpdFJlZ2V4OiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICBsZXQgc0ZpbmRlcjogc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZC5pbmRleE9mKFwie3h9XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmRleE9mKFwie3h9XCIpID09PSBpZC5sZW5ndGggLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNTcGxpdFJlZ2V4ID0gXCJcXFxcYlwiICsgaWQucmVwbGFjZShcIiB7eH1cIiwgXCJcIikgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNGaW5kZXIgPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fVwiLCBcIlxcXFxiICguKilcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1NwbGl0UmVnZXggPSBcIlxcXFxiXCIgKyBpZC5yZXBsYWNlKFwiIHt4fVwiLCBcIlxcXFxiIC4qPyBcXFxcYlwiKSArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc0ZpbmRlciA9IFwiXFxcXGJcIiArIGlkLnJlcGxhY2UoXCIge3h9IFwiLCBcIlxcXFxiICguKikgXFxcXGJcIikgKyBcIlxcXFxiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzU3BsaXRSZWdleCA9IFwiXFxcXGJcIiArIGlkICsgXCJcXFxcYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHNGaW5kZXIgPSBcIlxcXFxiXCIgKyBpZCArIFwiXFxcXGJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLkZpbmRlci5wdXNoKG5ldyBSZWdFeHAoc0ZpbmRlciwgXCJpXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuU3BsaXRSZWdleC5wdXNoKG5ldyBSZWdFeHAoc1NwbGl0UmVnZXgsIFwiZ2lcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmFsdWF0ZUNvbW1hbmRSZXN1bHQge1xyXG4gICAgICAgIHB1YmxpYyBDb21tYW5kOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIER5bmFtaWNGdW5jdGlvbjogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjbWQ6IHN0cmluZywgZm46IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLkNvbW1hbmQgPSBjbWQ7XHJcbiAgICAgICAgICAgIHRoaXMuRHluYW1pY0Z1bmN0aW9uID0gZm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgQ29udmVydFN0cmluZ0Z1bmN0aW9uKGZ1bmN0aW9uU3RyaW5nOiBzdHJpbmcsIG5vQXV0b1JldHVybj86IGJvb2xlYW4sIG5vQnJhY2tldFJlcGxhY2U/OiBib29sZWFuKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKGZ1bmN0aW9uU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogQ2Fubm90IGNvbnZlcnQgZW1wdHkgc3RyaW5nIHRvIGZ1bmN0aW9uXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFybmFtZVN0cmluZzogc3RyaW5nID0gZnVuY3Rpb25TdHJpbmdcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMCwgZnVuY3Rpb25TdHJpbmcuaW5kZXhPZihcIj0+XCIpKVxyXG4gICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpXHJcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCIoXCIpLmpvaW4oXCJcIilcclxuICAgICAgICAgICAgICAgIC5zcGxpdChcIilcIikuam9pbihcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YXJuYW1lczogc3RyaW5nW10gPSB2YXJuYW1lU3RyaW5nLnNwbGl0KFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBmdW5jOiBzdHJpbmcgPSBmdW5jdGlvblN0cmluZ1xyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZyhmdW5jdGlvblN0cmluZy5pbmRleE9mKFwiPT5cIikgKyAoXCI9PlwiKS5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vQnJhY2tldFJlcGxhY2UgPT0gbnVsbCB8fCBub0JyYWNrZXRSZXBsYWNlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgZnVuYy5yZXBsYWNlKFwie1wiLCBcIlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuYy5zcGxpdChcIi5tYXRjaCgvL2dpKVwiKS5qb2luKFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vQXV0b1JldHVybiA9PSBudWxsIHx8IG5vQXV0b1JldHVybiA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIC8qTm8gcmV0dXJuIG91dHNpZGUgb2YgcXVvdGF0aW9ucyovXHJcbiAgICAgICAgICAgICAgICBpZiAoZnVuYy5tYXRjaCgvcmV0dXJuKD89KFteXFxcIiddKltcXFwiJ11bXlxcXCInXSpbXFxcIiddKSpbXlxcXCInXSokKS9nKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYyA9IFwicmV0dXJuIFwiICsgZnVuYztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKC4uLnZhcm5hbWVzLCBmdW5jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ29udmVydEZ1bmN0aW9uPFQ+KHRlc3RGdW5jdGlvbjogc3RyaW5nIHwgVCwgbm9BdXRvUmV0dXJuPzogYm9vbGVhbiwgbm9CcmFja2V0UmVwbGFjZT86IGJvb2xlYW4pOiBUIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDogVDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGVzdEZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRlc3RGdW5jdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVzdEZ1bmN0aW9uID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0U3RyaW5nRnVuY3Rpb24odGVzdEZ1bmN0aW9uLCBub0F1dG9SZXR1cm4sIG5vQnJhY2tldFJlcGxhY2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMaW5xNEpTOiBDYW5ub3QgdXNlICcke3Rlc3RGdW5jdGlvbn0nIGFzIGZ1bmN0aW9uYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIE9yZGVyQ29tcGFyZUZ1bmN0aW9uPFQ+KHZhbHVlU2VsZWN0b3I6IChpdGVtOiBUKSA9PiBhbnksIGE6IFQsIGI6IFQsIGludmVydDogYm9vbGVhbik6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZV9hOiBhbnkgPSB2YWx1ZVNlbGVjdG9yKGEpO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVfYjogYW55ID0gdmFsdWVTZWxlY3RvcihiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0eXBlX2E6IHN0cmluZyA9IHR5cGVvZiB2YWx1ZV9hO1xyXG4gICAgICAgICAgICBsZXQgdHlwZV9iOiBzdHJpbmcgPSB0eXBlb2YgdmFsdWVfYjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlX2EgPT09IFwic3RyaW5nXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9hX3N0cmluZzogc3RyaW5nID0gdmFsdWVfYTtcclxuICAgICAgICAgICAgICAgIHZhbHVlX2Ffc3RyaW5nID0gdmFsdWVfYV9zdHJpbmcudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9iX3N0cmluZzogc3RyaW5nID0gdmFsdWVfYjtcclxuICAgICAgICAgICAgICAgIHZhbHVlX2Jfc3RyaW5nID0gdmFsdWVfYl9zdHJpbmcudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVfYV9zdHJpbmcgPiB2YWx1ZV9iX3N0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlcnQgPT09IHRydWUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlX2Ffc3RyaW5nIDwgdmFsdWVfYl9zdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52ZXJ0ID09PSB0cnVlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9hID09PSBcIm51bWJlclwiICYmIHR5cGVfYSA9PT0gdHlwZV9iKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYV9udW1iZXI6IG51bWJlciA9IHZhbHVlX2E7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVfYl9udW1iZXI6IG51bWJlciA9IHZhbHVlX2I7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA9PT0gdHJ1ZSA/IHZhbHVlX2JfbnVtYmVyIC0gdmFsdWVfYV9udW1iZXIgOiB2YWx1ZV9hX251bWJlciAtIHZhbHVlX2JfbnVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVfYSA9PT0gXCJib29sZWFuXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZV9hX2Jvb2w6IGJvb2xlYW4gPSB2YWx1ZV9hO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlX2JfYm9vbDogYm9vbGVhbiA9IHZhbHVlX2I7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlX2FfYm9vbCA9PT0gdmFsdWVfYl9ib29sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZlcnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlX2FfYm9vbCA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVfYV9ib29sID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlX2EgPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZV9hID09PSB0eXBlX2IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9hID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZV9iID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludmVydCA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTcGxpdENvbW1hbmQoY29tbWFuZDogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgc3BsaXRJbmRleGVzOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY21kIG9mIHRoaXMuQ29tbWFuZHMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHNwbGl0IG9mIGNtZC5TcGxpdFJlZ2V4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBzcGxpdC5leGVjKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0SW5kZXhlcy5wdXNoKHJlc3VsdC5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc3BsaXRJbmRleGVzID0gc3BsaXRJbmRleGVzLkRpc3RpbmN0KCkuT3JkZXJCeSh4ID0+IHgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdEluZGV4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzcGxpdEluZGV4ZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY29tbWFuZC5zdWJzdHIoc3BsaXRJbmRleGVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY29tbWFuZC5zdWJzdHIoc3BsaXRJbmRleGVzW2ldLCBzcGxpdEluZGV4ZXNbaSArIDFdIC0gc3BsaXRJbmRleGVzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJ0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTWF0Y2hDb21tYW5kKGNtZDogc3RyaW5nKTogRXZhbHVhdGVDb21tYW5kUmVzdWx0IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbW1hbmQgb2YgdGhpcy5Db21tYW5kcykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlZ2V4IG9mIGNvbW1hbmQuRmluZGVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsID0gY21kLm1hdGNoKHJlZ2V4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXZhbHVhdGVDb21tYW5kUmVzdWx0KGNvbW1hbmQuQ29tbWFuZCwgcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExpbnE0SlM6IE5vIG1hdGNoaW5nIGNvbW1hbmQgd2FzIGZvdW5kIGZvciAnJHtjbWR9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDb21tYW5kczogRXZhbHVhdGVDb21tYW5kW10gPSBbXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJDbG9uZVwiLCBcImNsb25lXCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiUmV2ZXJzZVwiLCBcInJldmVyc2VcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJXaGVyZVwiLCBcIndoZXJlIHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlNlbGVjdFwiLCBcInNlbGVjdCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJHZXRcIiwgXCJnZXQge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRm9yRWFjaFwiLCBcImZvcmVhY2gge3h9XCIsIFwiZm9yIGVhY2gge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiQ291bnRcIiwgXCJjb3VudFwiLCBcImNvdW50IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkFsbFwiLCBcImFsbCB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJBbnlcIiwgXCJhbnkge3h9XCIsIFwiYW55XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGFrZVwiLCBcInRha2Uge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2tpcFwiLCBcInNraXAge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiTWluXCIsIFwibWluIHt4fVwiLCBcIm1pblwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIk1heFwiLCBcIm1heCB7eH1cIiwgXCJtYXhcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJHcm91cEJ5XCIsIFwiZ3JvdXBieSB7eH1cIiwgXCJncm91cCBieSB7eH1cIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJEaXN0aW5jdFwiLCBcImRpc3RpbmN0IHt4fVwiLCBcImRpc3RpbmN0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiRmluZExhc3RJbmRleFwiLCBcImZpbmRsYXN0aW5kZXgge3h9XCIsIFwiZmluZCBsYXN0IGluZGV4IHt4fVwiLCBcImZpbmRpbmRleCB7eH0gbGFzdFwiLCBcImZpbmQgaW5kZXgge3h9IGxhc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJGaW5kSW5kZXhcIiwgXCJmaW5kZmlyc3RpbmRleCB7eH1cIiwgXCJmaW5kIGZpcnN0IGluZGV4IHt4fVwiLCBcImZpbmRpbmRleCB7eH0gZmlyc3RcIiwgXCJmaW5kIGluZGV4IHt4fSBmaXJzdFwiLCBcImZpbmRpbmRleCB7eH1cIiwgXCJmaW5kIGluZGV4IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIk9yZGVyQnlEZXNjZW5kaW5nXCIsIFwib3JkZXJieSB7eH0gZGVzY2VuZGluZ1wiLCBcIm9yZGVyIGJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwib3JkZXJieSBkZXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyYnlkZXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyIGJ5IGRlc2NlbmRpbmcge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiT3JkZXJCeVwiLCBcIm9yZGVyYnkge3h9IGFzY2VuZGluZ1wiLCBcIm9yZGVyIGJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJvcmRlcmJ5YXNjZW5kaW5nIHt4fVwiLCBcIm9yZGVyIGJ5IGFzY2VuZGluZyB7eH1cIiwgXCJvcmRlcmJ5IHt4fVwiLCBcIm9yZGVyIGJ5IHt4fVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpcnN0T3JEZWZhdWx0XCIsIFwiZmlyc3RvcmRlZmF1bHQge3h9XCIsIFwiZmlyc3Qgb3IgZGVmYXVsdCB7eH1cIiwgXCJmaXJzdG9yZGVmYXVsdFwiLCBcImZpcnN0IG9yIGRlZmF1bHRcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJMYXN0T3JEZWZhdWx0XCIsIFwibGFzdG9yZGVmYXVsdCB7eH1cIiwgXCJsYXN0IG9yIGRlZmF1bHQge3h9XCIsIFwibGFzdG9yZGVmYXVsdFwiLCBcImxhc3Qgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlNpbmdsZU9yRGVmYXVsdFwiLCBcInNpbmdsZW9yZGVmYXVsdCB7eH1cIiwgXCJzaW5nbGUgb3IgZGVmYXVsdCB7eH1cIiwgXCJzaW5nbGVvcmRlZmF1bHRcIiwgXCJzaW5nbGUgb3IgZGVmYXVsdFwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIkZpcnN0XCIsIFwiZmlyc3Qge3h9XCIsIFwiZmlyc3RcIiksXHJcbiAgICAgICAgICAgIG5ldyBFdmFsdWF0ZUNvbW1hbmQoXCJMYXN0XCIsIFwibGFzdCB7eH1cIiwgXCJsYXN0XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiU2luZ2xlXCIsIFwic2luZ2xlIHt4fVwiLCBcInNpbmdsZVwiKSxcclxuICAgICAgICAgICAgbmV3IEV2YWx1YXRlQ29tbWFuZChcIlRoZW5CeURlc2NlbmRpbmdcIiwgXCJ0aGVuYnkge3h9IGRlc2NlbmRpbmdcIiwgXCJ0aGVuIGJ5IHt4fSBkZXNjZW5kaW5nXCIsIFwidGhlbmJ5ZGVzY2VuZGluZyB7eH1cIiwgXCJ0aGVuIGJ5IGRlc2NlbmRpbmcge3h9XCIpLFxyXG4gICAgICAgICAgICBuZXcgRXZhbHVhdGVDb21tYW5kKFwiVGhlbkJ5XCIsIFwidGhlbmJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJ0aGVuIGJ5IHt4fSBhc2NlbmRpbmdcIiwgXCJ0aGVuYnlhc2NlbmRpbmcge3h9XCIsIFwidGhlbiBieSBhc2NlbmRpbmcge3h9XCIsIFwidGhlbmJ5IHt4fVwiLCBcInRoZW4gYnkge3h9XCIpXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIkFycmF5LnByb3RvdHlwZS5BZGQgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3Q6IFQsIGdlbmVyYXRlSWQ/OiBib29sZWFuKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChvYmplY3QgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChnZW5lcmF0ZUlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdJbmRleDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhc3RlZE9iamVjdDogTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkgPSBvYmplY3QgYXMgYW55O1xyXG4gICAgICAgICAgICBsZXQgbGFzdDogTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkgPSB0aGF0LldoZXJlKCh4OiBhbnkpID0+IHguX0dlbmVyYXRlZElkXyAhPSBudWxsKS5PcmRlckJ5KCh4OiBhbnkpID0+IHguX0dlbmVyYXRlZElkXykuTGFzdE9yRGVmYXVsdCgpIGFzIGFueTtcclxuICAgICAgICAgICAgaWYgKGxhc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBsYXN0Ll9HZW5lcmF0ZWRJZF8gIT0gbnVsbCA/IGxhc3QuX0dlbmVyYXRlZElkXyA6IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoYXQuQW55KGZ1bmN0aW9uKHg6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuX0dlbmVyYXRlZElkXyA9PT0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0luZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF8gPSBuZXdJbmRleDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhhdC5wdXNoKG9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkFkZFJhbmdlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0czogVFtdLCBnZW5lcmF0ZUlkOiBib29sZWFuKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgIHRoYXQuQWRkKHgsIGdlbmVyYXRlSWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG1ldGhvZDogKChyZXN1bHQ6IGFueSwgaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZywgc3RhcnRWYWw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHJlc3VsdDogYW55O1xyXG5cclxuICAgIGlmIChzdGFydFZhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc3RhcnRWYWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1ldGhvZEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChyZXN1bHQ6IGFueSwgaXRlbTogVCkgPT4gYW55PihtZXRob2QpO1xyXG5cclxuICAgIHRoYXQuRm9yRWFjaChmdW5jdGlvbih4KXtcclxuICAgICAgICByZXN1bHQgPSBtZXRob2RGdW5jdGlvbihyZXN1bHQsIHgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuQWxsID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdC5Db3VudChmaWx0ZXIpID09PSB0aGF0LkNvdW50KCk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkFueSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiB0aGF0LkNvdW50KGZpbHRlcikgPiAwO1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5BdmVyYWdlID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGxldCBhcnJheTogYW55W10gPSB0aGF0O1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gYXJyYXkuU2VsZWN0KHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJheS5Gb3JFYWNoKGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJlc3VsdCArPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdCAvIGFycmF5LkNvdW50KCk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkNsb25lID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgbmV3QXJyYXk6IFRbXSA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IG9iaiBvZiB0aGF0KSB7XHJcbiAgICAgICAgbmV3QXJyYXkuQWRkKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Db25jYXQgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG4gICAgdGhhdCA9IHRoYXQuY29uY2F0KGFycmF5KTtcclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Db250YWlucyA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdDogVCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIHRoYXQuQW55KGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgIHJldHVybiB4ID09PSBvYmplY3Q7XHJcbiAgICB9KTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuQ291bnQgPSBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0aGF0LldoZXJlKGZpbHRlcikubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhhdC5sZW5ndGg7XHJcbiAgICB9XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkRpc3RpbmN0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoYXQuV2hlcmUoKHgsIGkpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuRmluZEluZGV4KHkgPT4gdmFsdWVTZWxlY3RvckZ1bmN0aW9uKHkpID09PSB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24oeCkpID09PSBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhhdC5XaGVyZSgoeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5GaW5kSW5kZXgoeSA9PiB5ID09PSB4KSA9PT0gaTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuRXZhbHVhdGUgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBjb21tYW5kOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IGNvbW1hbmRQYXJ0czogc3RyaW5nW10gPSBMaW5xNEpTLkhlbHBlci5TcGxpdENvbW1hbmQoY29tbWFuZCk7XHJcblxyXG4gICAgbGV0IGNvbXB1dGVPYmplY3Q6IGFueSA9IHRoYXQ7XHJcblxyXG4gICAgZm9yIChsZXQgY21kIG9mIGNvbW1hbmRQYXJ0cykge1xyXG4gICAgICAgIGxldCBjbWRSZXN1bHQgPSBMaW5xNEpTLkhlbHBlci5NYXRjaENvbW1hbmQoY21kKTtcclxuXHJcbiAgICAgICAgY29tcHV0ZU9iamVjdCA9IGNvbXB1dGVPYmplY3RbY21kUmVzdWx0LkNvbW1hbmRdKGNtZFJlc3VsdC5EeW5hbWljRnVuY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb21wdXRlT2JqZWN0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5GaW5kSW5kZXggPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZpbHRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBib29sZWFuPihmaWx0ZXIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoYXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG9iajogVCA9IHRoYXRbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRnVuY3Rpb24ob2JqKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5GaW5kTGFzdEluZGV4ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyOiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYm9vbGVhbj4oZmlsdGVyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoYXQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgbGV0IG9iajogVCA9IHRoYXRbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsdGVyRnVuY3Rpb24ob2JqKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5GaXJzdCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBUIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoYXQuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5BbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgRmlyc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGF0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgRmlyc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkZpcnN0T3JEZWZhdWx0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVFtdID0gdGhhdC5XaGVyZShmaWx0ZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoYXQuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuRm9yRWFjaCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFjdGlvbjogKChpdGVtOiBULCBpbmRleD86IG51bWJlcikgPT4gYm9vbGVhbiB8IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IGFjdGlvbkZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBpbmRleD86IG51bWJlcikgPT4gYm9vbGVhbiB8IGFueT4oYWN0aW9uLCB0cnVlKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoYXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYWN0aW9uRnVuY3Rpb24odGhhdFtpXSwgaSk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5HZXQgPSBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBpbmRleDogbnVtYmVyKTogVCB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdFtpbmRleF07XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkdyb3VwQnkgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBzZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHNlbGVjdG9yRnVuY3Rpb246IChpdGVtOiBUKSA9PiBhbnkgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4oc2VsZWN0b3IpO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogVFtdW10gPSBbXTtcclxuXHJcbiAgICBsZXQgb3JkZXJlZDogVFtdID0gdGhhdC5PcmRlckJ5KHNlbGVjdG9yRnVuY3Rpb24pO1xyXG5cclxuICAgIGxldCBwcmV2OiBUO1xyXG4gICAgbGV0IG5ld1N1YjogVFtdID0gW107XHJcblxyXG4gICAgb3JkZXJlZC5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgIGlmIChwcmV2ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yRnVuY3Rpb24ocHJldikgIT09IHNlbGVjdG9yRnVuY3Rpb24oeCkpIHtcclxuICAgICAgICAgICAgICAgIG5ld0FycmF5LkFkZChuZXdTdWIpO1xyXG4gICAgICAgICAgICAgICAgbmV3U3ViID0gW107XHJcbiAgICAgICAgICAgICAgICBuZXdTdWIuR3JvdXBWYWx1ZSA9IHNlbGVjdG9yRnVuY3Rpb24oeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdTdWIuR3JvdXBWYWx1ZSA9IHNlbGVjdG9yRnVuY3Rpb24oeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdTdWIuQWRkKHgpO1xyXG4gICAgICAgIHByZXYgPSB4O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG5ld1N1Yi5Db3VudCgpID4gMCkge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChuZXdTdWIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuSW5zZXJ0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBpbmRleDogbnVtYmVyKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIHRoYXQuc3BsaWNlKGluZGV4LCAwLCBvYmplY3QpO1xyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5JbnRlcnNlY3QgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBhcnJheTogVFtdKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgdGhhdC5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgIGlmIChhcnJheS5Db250YWlucyh4KSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5BZGQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXJyYXkuRm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAodGhhdC5Db250YWlucyh4KSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5BZGQoeCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0FycmF5LkRpc3RpbmN0KCk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkpvaW4gPSBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBjaGFyOiBzdHJpbmcsIHNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCBhcnJheTogYW55W10gPSB0aGF0O1xyXG5cclxuICAgIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgYXJyYXkgPSB0aGF0LlNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFycmF5LmpvaW4oY2hhcik7XHJcbn07XHJcbiIsIkFycmF5LnByb3RvdHlwZS5MYXN0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IFQge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVFtdID0gdGhhdC5XaGVyZShmaWx0ZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LkFueSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuR2V0KHJlc3VsdC5sZW5ndGggLSAxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgTGFzdCBFbnRyeSB3YXMgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoYXQuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuR2V0KHRoYXQubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIExhc3QgRW50cnkgd2FzIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLkxhc3RPckRlZmF1bHQgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI/OiAoKGl0ZW06IFQpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUW10gPSB0aGF0LldoZXJlKGZpbHRlcik7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQocmVzdWx0Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoYXQuQW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuR2V0KHRoYXQubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5NYXggPSBmdW5jdGlvbiA8VD4odGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuICAgICAgICByZXR1cm4gdGhhdC5PcmRlckJ5KHZhbHVlU2VsZWN0b3JGdW5jdGlvbikuTGFzdE9yRGVmYXVsdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhhdC5PcmRlckJ5KHggPT4geCkuTGFzdE9yRGVmYXVsdCgpO1xyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5NaW4gPSBmdW5jdGlvbiA8VD4odGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogKFQgfCBudWxsKSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAodmFsdWVTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoYXQuT3JkZXJCeSh2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pLkZpcnN0T3JEZWZhdWx0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGF0Lk9yZGVyQnkoeCA9PiB4KS5GaXJzdE9yRGVmYXVsdCgpO1xyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Nb3ZlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2xkSW5kZXg6IG51bWJlciwgbmV3SW5kZXg6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICB0aGF0LnNwbGljZShuZXdJbmRleCwgMCwgdGhhdC5zcGxpY2Uob2xkSW5kZXgsIDEpWzBdKTtcclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5PcmRlckJ5ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoYXQuQ2xvbmUoKTtcclxuICAgIG9yZGVyZWQuT3JkZXIgPSBuZXcgQXJyYXk8TGlucTRKUy5PcmRlckVudHJ5PihuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uQXNjZW5kaW5nLCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24pKTtcclxuXHJcbiAgICByZXR1cm4gb3JkZXJlZC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKHZhbHVlU2VsZWN0b3JGdW5jdGlvbiwgYSwgYiwgZmFsc2UpO1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLk9yZGVyQnlEZXNjZW5kaW5nID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgdmFsdWVTZWxlY3RvcjogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCB2YWx1ZVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4odmFsdWVTZWxlY3Rvcik7XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoYXQuQ2xvbmUoKTtcclxuICAgIG9yZGVyZWQuT3JkZXIgPSBuZXcgQXJyYXk8TGlucTRKUy5PcmRlckVudHJ5PihuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uRGVzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBMaW5xNEpTLkhlbHBlci5PcmRlckNvbXBhcmVGdW5jdGlvbih2YWx1ZVNlbGVjdG9yRnVuY3Rpb24sIGEsIGIsIHRydWUpO1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlJhbmdlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgc3RhcnQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IG5ld0FycmF5OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBzdGFydCArIGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbmV3QXJyYXkuQWRkKHRoYXQuR2V0KGkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlJlbW92ZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIG9iamVjdDogVCwgcHJpbWFyeUtleVNlbGVjdG9yPzogKChpdGVtOiBUKSA9PiBhbnkpIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGxldCB0YXJnZXRJbmRleDogbnVtYmVyO1xyXG5cclxuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBvYmplY3QgY2Fubm90IGJlIG51bGxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNhc3RlZE9iamVjdDogTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkgPSBvYmplY3QgYXMgYW55O1xyXG5cclxuICAgIGlmIChwcmltYXJ5S2V5U2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55PihwcmltYXJ5S2V5U2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoYXQuRmluZEluZGV4KGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Rvcih4KSA9PT0gc2VsZWN0b3Iob2JqZWN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF8gIT0gbnVsbCkge1xyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhhdC5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHggYXMgTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkpLl9HZW5lcmF0ZWRJZF8gPT09IGNhc3RlZE9iamVjdC5fR2VuZXJhdGVkSWRfO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChjYXN0ZWRPYmplY3QuSWQgIT0gbnVsbCkge1xyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhhdC5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHggYXMgTGlucTRKUy5HZW5lcmF0ZWRFbnRpdHkpLklkID09PSBjYXN0ZWRPYmplY3QuSWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhhdC5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHggPT09IG9iamVjdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0SW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgdGhhdC5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBOb3RoaW5nIGZvdW5kIHRvIFJlbW92ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuUmVtb3ZlUmFuZ2UgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBvYmplY3RzOiBUW10sIHByaW1hcnlLZXlTZWxlY3Rvcj86ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBpZiAocHJpbWFyeUtleVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4ocHJpbWFyeUtleVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuUmVtb3ZlKHgsIHNlbGVjdG9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqZWN0cy5Gb3JFYWNoKGZ1bmN0aW9uICh4OiBUKSB7XHJcbiAgICAgICAgICAgIHRoYXQuUmVtb3ZlKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5SZXBlYXQgPSBmdW5jdGlvbiA8VD4odGhpczogVFtdLCBvYmplY3Q6IFQsIGNvdW50OiBudW1iZXIpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdGhhdC5BZGQob2JqZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuUmV2ZXJzZSA9IGZ1bmN0aW9uIDxUPih0aGlzOiBUW10pOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcbiAgICByZXR1cm4gdGhhdC5yZXZlcnNlKCk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlNlbGVjdCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBhbnlbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgc2VsZWN0b3JXb3JrOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcgPSBzZWxlY3RvcjtcclxuXHJcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yV29yayA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIGxldCBzZWxlY3RTdGF0ZW1lbnQgPSBzZWxlY3Rvcldvcmsuc3Vic3RyKHNlbGVjdG9yV29yay5pbmRleE9mKFwiPT5cIikgKyAoXCI9PlwiKS5sZW5ndGgpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZWN0U3RhdGVtZW50Lm1hdGNoKC9eXFxzKnsuKn1cXHMqJC8pICE9IG51bGwpIHtcclxuICAgICAgICAgICAgc2VsZWN0U3RhdGVtZW50ID0gc2VsZWN0U3RhdGVtZW50LnJlcGxhY2UoL15cXHMqeyguKil9XFxzKiQvLCBcIiQxXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcnRzID0gc2VsZWN0U3RhdGVtZW50LnNwbGl0KC8sKD89KD86W14nXCJdKlsnXCJdW14nXCJdKlsnXCJdKSpbXidcIl0qJCkvZyk7XHJcbiAgICAgICAgICAgIGxldCBuZXdDb250ZW50ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnQuaW5kZXhPZihcIjpcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29udGVudCArPSBwYXJ0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0LmluZGV4T2YoXCI9XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gcGFydC5yZXBsYWNlKFwiPVwiLCBcIjpcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBwYXJ0LnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29udGVudCArPSBuYW1lICsgXCI6XCIgKyBwYXJ0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgcGFydHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRlbnQgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGVjdG9yV29yayA9IHNlbGVjdG9yV29yay5zdWJzdHIoMCwgc2VsZWN0b3JXb3JrLmluZGV4T2YoXCI9PlwiKSkgKyBcIj0+IHJldHVybiB7XCIgKyBuZXdDb250ZW50ICsgXCJ9XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBzZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHNlbGVjdG9yV29yaywgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgIGxldCBuZXdBcnJheTogYW55W10gPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmogb2YgdGhhdCkge1xyXG4gICAgICAgIG5ld0FycmF5LkFkZChzZWxlY3RvckZ1bmN0aW9uKG9iaikpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdBcnJheTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuU2VxdWVuY2VFcXVhbCA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGFycmF5OiBUW10pOiBib29sZWFuIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmICh0aGF0LkNvdW50KCkgIT09IGFycmF5LkNvdW50KCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGF0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGF0W2ldKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpe1xyXG4gICAgICAgICAgICBpZiAoKHRoYXRbaV0gYXMgYW55KVtrZXldICE9PSAoYXJyYXlbaV0gYXMgYW55KVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlNpbmdsZSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiAoVCB8IG51bGwpIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFRbXSA9IHRoYXQuV2hlcmUoZmlsdGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5Db3VudCgpID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuR2V0KDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFRoZSBhcnJheSBkb2VzIG5vdCBjb250YWluIGV4YWN0bHkgb25lIGVsZW1lbnRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhhdC5Db3VudCgpID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5xNEpTOiBUaGUgYXJyYXkgZG9lcyBub3QgY29udGFpbiBleGFjdGx5IG9uZSBlbGVtZW50XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCJBcnJheS5wcm90b3R5cGUuU2luZ2xlT3JEZWZhdWx0ID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgZmlsdGVyPzogKChpdGVtOiBUKSA9PiBib29sZWFuKSB8IHN0cmluZyk6IChUIHwgbnVsbCkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGZpbHRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVFtdID0gdGhhdC5XaGVyZShmaWx0ZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0LkNvdW50KCkgPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5HZXQoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5Db3VudCgpID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIGFycmF5IGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhhdC5Db3VudCgpID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LkdldCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhhdC5Db3VudCgpID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIGFycmF5IGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIkFycmF5LnByb3RvdHlwZS5Ta2lwID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdC5zbGljZShjb3VudCwgdGhhdC5Db3VudCgpKTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuU3VtID0gZnVuY3Rpb24gPFQ+KHRoaXM6IFRbXSwgc2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIGZpbHRlcj86ICgoaXRlbTogVCkgPT4gYm9vbGVhbikgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuICAgIGxldCBhcnJheTogYW55W10gPSBbXTtcclxuXHJcbiAgICBpZiAoZmlsdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhcnJheSA9IHRoYXQuV2hlcmUoZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xyXG4gICAgICAgIGFycmF5ID0gdGhhdC5TZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmF5LkZvckVhY2goZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmVzdWx0ICs9IHg7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59OyIsIkFycmF5LnByb3RvdHlwZS5UYWtlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gdGhhdC5zbGljZSgwLCBjb3VudCk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRha2VXaGlsZSA9IGZ1bmN0aW9uPFQ+IChcclxuICAgIHRoaXM6IFRbXSxcclxuICAgIGNvbmRpdGlvbjogKChpdGVtOiBULCBzdG9yYWdlPzogYW55KSA9PiBib29sZWFuKSB8IHN0cmluZyxcclxuICAgIGluaXRpYWw/OiAoKHN0b3JhZ2U6IGFueSkgPT4gdm9pZCkgfCBzdHJpbmcsXHJcbiAgICBhZnRlcj86ICgoaXRlbTogVCwgc3RvcmFnZTogYW55KSA9PiB2b2lkKSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgY29uZGl0aW9uRnVuY3Rpb246IChpdGVtOiBULCBzdG9yYWdlPzogYW55KSA9PiBib29sZWFuID1cclxuICAgICAgICBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQsIHN0b3JhZ2U/OiBhbnkpID0+IGJvb2xlYW4+KGNvbmRpdGlvbik7XHJcblxyXG4gICAgbGV0IHN0b3JhZ2U6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmIChpbml0aWFsICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgaW5pdGlhbEZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGluaXRpYWwpO1xyXG4gICAgICAgIGluaXRpYWxGdW5jdGlvbihzdG9yYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYWZ0ZXJGdW5jdGlvbjogKChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKGFmdGVyICE9IG51bGwpIHtcclxuICAgICAgICBhZnRlckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBULCBzdG9yYWdlOiBhbnkpID0+IHZvaWQ+KGFmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBvYmplY3Qgb2YgdGhhdCl7XHJcbiAgICAgICAgaWYgKGNvbmRpdGlvbkZ1bmN0aW9uKG9iamVjdCwgc3RvcmFnZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmVzdWx0LkFkZChvYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFmdGVyRnVuY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXJGdW5jdGlvbihvYmplY3QsIHN0b3JhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRoZW5CeSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIHZhbHVlU2VsZWN0b3I6ICgoaXRlbTogVCkgPT4gYW55KSB8IHN0cmluZyk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGF0Lk9yZGVyID09IG51bGwgfHwgdGhhdC5PcmRlci5Db3VudCgpID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogUGxlYXNlIGNhbGwgT3JkZXJCeSBvciBPcmRlckJ5RGVzY2VuZGluZyBiZWZvcmUgVGhlbkJ5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmVkOiBUW10gPSB0aGF0O1xyXG4gICAgb3JkZXJlZC5PcmRlci5BZGQobmV3IExpbnE0SlMuT3JkZXJFbnRyeShMaW5xNEpTLk9yZGVyRGlyZWN0aW9uLkFzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBvcmRlcmVkLk9yZGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKGVudHJ5LlZhbHVlU2VsZWN0b3IsIGEsIGIsIGVudHJ5LkRpcmVjdGlvbiA9PT0gTGlucTRKUy5PcmRlckRpcmVjdGlvbi5EZXNjZW5kaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRoZW5CeURlc2NlbmRpbmcgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCB2YWx1ZVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHZhbHVlU2VsZWN0b3JGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCkgPT4gYW55Pih2YWx1ZVNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhhdC5PcmRlciA9PSBudWxsIHx8IHRoYXQuT3JkZXIuQ291bnQoKSA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbnE0SlM6IFBsZWFzZSBjYWxsIE9yZGVyQnkgb3IgT3JkZXJCeURlc2NlbmRpbmcgYmVmb3JlIFRoZW5CeURlc2NlbmRpbmdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9yZGVyZWQ6IFRbXSA9IHRoYXQ7XHJcbiAgICBvcmRlcmVkLk9yZGVyLkFkZChuZXcgTGlucTRKUy5PcmRlckVudHJ5KExpbnE0SlMuT3JkZXJEaXJlY3Rpb24uRGVzY2VuZGluZywgdmFsdWVTZWxlY3RvckZ1bmN0aW9uKSk7XHJcblxyXG4gICAgcmV0dXJuIG9yZGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBvcmRlcmVkLk9yZGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IExpbnE0SlMuSGVscGVyLk9yZGVyQ29tcGFyZUZ1bmN0aW9uKGVudHJ5LlZhbHVlU2VsZWN0b3IsIGEsIGIsIGVudHJ5LkRpcmVjdGlvbiA9PT0gTGlucTRKUy5PcmRlckRpcmVjdGlvbi5EZXNjZW5kaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlRvRGljdGlvbmFyeSA9IGZ1bmN0aW9uPFQ+ICh0aGlzOiBUW10sIGtleVNlbGVjdG9yOiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcsIHZhbHVlU2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IGtleVNlbGVjdG9yRnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGl0ZW06IFQpID0+IGFueT4oa2V5U2VsZWN0b3IpO1xyXG5cclxuICAgIGxldCByZXR1cm5PYmplY3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIGlmICh2YWx1ZVNlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBsZXQgdmFsdWVTZWxlY3RvckZ1bmN0aW9uID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHZhbHVlU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB0aGF0LkZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybk9iamVjdFtrZXlTZWxlY3RvckZ1bmN0aW9uKHgpXSA9IHZhbHVlU2VsZWN0b3JGdW5jdGlvbih4KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhhdC5Gb3JFYWNoKHggPT4ge1xyXG4gICAgICAgICAgICByZXR1cm5PYmplY3Rba2V5U2VsZWN0b3JGdW5jdGlvbih4KV0gPSB4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXR1cm5PYmplY3Q7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlVuaW9uID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuICAgIHJldHVybiB0aGF0LkNvbmNhdChhcnJheSkuRGlzdGluY3QoKTtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuVXBkYXRlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0OiBULCBwcmltYXJ5S2V5U2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgbGV0IHRhcmdldEluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogVGhlIG9iamVjdCBjYW5ub3QgYmUgbnVsbFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2FzdGVkT2JqZWN0OiBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSA9IG9iamVjdCBhcyBhbnk7XHJcblxyXG4gICAgaWYgKHByaW1hcnlLZXlTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHByaW1hcnlLZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhhdC5GaW5kSW5kZXgoZnVuY3Rpb24gKHg6IFQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yKHgpID09PSBzZWxlY3RvcihvYmplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChjYXN0ZWRPYmplY3QuX0dlbmVyYXRlZElkXyAhPSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuX0dlbmVyYXRlZElkXyA9PT0gY2FzdGVkT2JqZWN0Ll9HZW5lcmF0ZWRJZF87XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGNhc3RlZE9iamVjdC5JZCAhPSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoeCBhcyBMaW5xNEpTLkdlbmVyYXRlZEVudGl0eSkuSWQgPT09IGNhc3RlZE9iamVjdC5JZDtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGF0LkZpbmRJbmRleChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICByZXR1cm4geCA9PT0gb2JqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBsZXQga2V5czogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhvYmplY3QpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSBcIklkXCIpIHtcclxuICAgICAgICAgICAgICAgICh0aGF0W3RhcmdldEluZGV4XSBhcyBhbnkpW2tleV0gPSAob2JqZWN0IGFzIGFueSlba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogTm90aGluZyBmb3VuZCB0byBVcGRhdGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn07IiwiQXJyYXkucHJvdG90eXBlLlVwZGF0ZVJhbmdlID0gZnVuY3Rpb248VD4gKHRoaXM6IFRbXSwgb2JqZWN0czogVFtdLCBwcmltYXJ5S2V5U2VsZWN0b3I/OiAoKGl0ZW06IFQpID0+IGFueSkgfCBzdHJpbmcpOiBUW10ge1xyXG4gICAgbGV0IHRoYXQ6IFRbXSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHByaW1hcnlLZXlTZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gTGlucTRKUy5IZWxwZXIuQ29udmVydEZ1bmN0aW9uPChpdGVtOiBUKSA9PiBhbnk+KHByaW1hcnlLZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICB0aGF0LlVwZGF0ZSh4LCBzZWxlY3Rvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9iamVjdHMuRm9yRWFjaChmdW5jdGlvbiAoeDogVCkge1xyXG4gICAgICAgICAgICB0aGF0LlVwZGF0ZSh4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxufTsiLCJBcnJheS5wcm90b3R5cGUuV2hlcmUgPSBmdW5jdGlvbjxUPiAodGhpczogVFtdLCBmaWx0ZXI6ICgoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4pIHwgc3RyaW5nKTogVFtdIHtcclxuICAgIGxldCB0aGF0OiBUW10gPSB0aGlzO1xyXG5cclxuICAgIGlmIChmaWx0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJGdW5jdGlvbiA9IExpbnE0SlMuSGVscGVyLkNvbnZlcnRGdW5jdGlvbjwoaXRlbTogVCwgaW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW4+KGZpbHRlcik7XHJcblxyXG4gICAgICAgIGxldCBuZXdBcnJheTogVFtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBUID0gdGhhdFtpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWx0ZXJGdW5jdGlvbihvYmosIGkpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGlucTRKUzogWW91IG11c3QgZGVmaW5lIGEgZmlsdGVyXCIpO1xyXG4gICAgfVxyXG5cclxufTsiLCJBcnJheS5wcm90b3R5cGUuWmlwID0gZnVuY3Rpb248VCwgWD4gKHRoaXM6IFRbXSwgYXJyYXk6IFhbXSwgcmVzdWx0OiAoKGZpcnN0OiBULCBzZWNvbmQ6IFgpID0+IGFueSkgfCBzdHJpbmcpOiBhbnlbXSB7XHJcbiAgICBsZXQgdGhhdDogVFtdID0gdGhpcztcclxuXHJcbiAgICBsZXQgcmVzdWx0RnVuY3Rpb24gPSBMaW5xNEpTLkhlbHBlci5Db252ZXJ0RnVuY3Rpb248KGZpcnN0OiBULCBzZWNvbmQ6IFgpID0+IGFueT4ocmVzdWx0KTtcclxuXHJcbiAgICBsZXQgbmV3QXJyYXkgPSBuZXcgQXJyYXk8YW55PigpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChhcnJheVtpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG5ld0FycmF5LkFkZChyZXN1bHRGdW5jdGlvbih0aGF0W2ldLCBhcnJheVtpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3QXJyYXk7XHJcbn07IiwibmFtZXNwYWNlIExpbnE0SlMge1xyXG4gICAgZXhwb3J0IGNsYXNzIE9yZGVyRW50cnkge1xyXG4gICAgICAgIHB1YmxpYyBEaXJlY3Rpb246IE9yZGVyRGlyZWN0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWYWx1ZVNlbGVjdG9yOiAoaXRlbTogYW55KSA9PiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKF9kaXJlY3Rpb246IE9yZGVyRGlyZWN0aW9uLCBfdmFsdWVTZWxlY3RvcjogKGl0ZW06IGFueSkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuRGlyZWN0aW9uID0gX2RpcmVjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5WYWx1ZVNlbGVjdG9yID0gX3ZhbHVlU2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBlbnVtIE9yZGVyRGlyZWN0aW9uIHtcclxuICAgICAgICBBc2NlbmRpbmcsIERlc2NlbmRpbmdcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBMaW5xNEpTIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RFbnRyeSB7XHJcbiAgICAgICAgcHVibGljIHByb3BlcnR5OiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Iobjogc3RyaW5nLCBwOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gbjtcclxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
