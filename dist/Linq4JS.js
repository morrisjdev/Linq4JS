var Linq4JS;
(function (Linq4JS) {
    var Entity = (function () {
        function Entity(_id) {
            this.Id = _id;
        }
        return Entity;
    }());
    Linq4JS.Entity = Entity;
})(Linq4JS || (Linq4JS = {}));
var Linq4JS;
(function (Linq4JS) {
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    }());
    Helper.ConvertStringFunction = function (functionString) {
        if (functionString.length == 0) {
            throw "Linq4JS: Cannot convert empty string to function";
        }
        var varnameString = functionString.substring(0, functionString.indexOf("=>")).replace(" ", "").replace("(", "").replace(")", "");
        var varnames = varnameString.split(",");
        var func = functionString
            .substring(functionString.indexOf("=>") + 2)
            .replace("{", "").replace("}", "")
            .split(".match(//gi)").join("");
        /*No return outside of quotations*/
        if (func.match(/return(?=([^\"']*[\"'][^\"']*[\"'])*[^\"']*$)/g) == null) {
            func = "return " + func;
        }
        return Function.apply(void 0, varnames.concat([func]));
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
    Linq4JS.Helper = Helper;
})(Linq4JS || (Linq4JS = {}));
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
Array.prototype.Add = function (object, generateId) {
    var that = this;
    if (object != null) {
        if (generateId == true) {
            var newIndex_1;
            var last = that.LastOrDefault();
            if (last != null) {
                newIndex_1 = last["_Id"] != null ? last["_Id"] : 1;
                while (that.Any(function (x) {
                    return x["_Id"] == newIndex_1;
                })) {
                    newIndex_1++;
                }
                object["_Id"] = newIndex_1;
            }
            else {
                object["_Id"] = 1;
            }
        }
        that.push(object);
    }
    return that;
};
Array.prototype.AddRange = function (objects) {
    var that = this;
    objects.ForEach(function (x) {
        that.Add(x);
    });
    return that;
};
Array.prototype.Aggregate = function (method) {
    var that = this;
    var result = "";
    var methodFunction = Linq4JS.Helper.ConvertFunction(method);
    that.ForEach(function (x) {
        result = methodFunction(result, x);
    });
    return result;
};
Array.prototype.All = function (filter) {
    var that = this;
    return that.Count(filter) == that.Count();
};
Array.prototype.Any = function (filter) {
    var that = this;
    return that.Count(filter) > 0;
};
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
Array.prototype.Clone = function () {
    var that = this;
    var newArray = new Array();
    for (var _i = 0, that_1 = that; _i < that_1.length; _i++) {
        var obj = that_1[_i];
        newArray.Add(obj);
    }
    return newArray;
};
Array.prototype.Concat = function (array) {
    var that = this;
    that = that.concat(array);
    return that;
};
Array.prototype.Contains = function (object) {
    var that = this;
    return that.Any(function (x) {
        return x == object;
    });
};
Array.prototype.Count = function (filter) {
    var that = this;
    if (filter != null) {
        return that.Where(filter).length;
    }
    else {
        return that.length;
    }
};
Array.prototype.Distinct = function (valueSelector, takelast) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var temp = that.OrderBy(valueSelectorFunction);
    var newArray = new Array();
    var prev;
    for (var i = 0; i < temp.length; i++) {
        var current = temp[i];
        if (takelast == true) {
            var next = temp[i + 1];
            if (next != null) {
                if (valueSelectorFunction(current) != valueSelectorFunction(next)) {
                    newArray.Add(current);
                }
            }
            else {
                newArray.Add(current);
            }
        }
        else {
            if (prev != null && valueSelectorFunction(current) == valueSelectorFunction(prev)) {
                continue;
            }
            else {
                newArray.Add(current);
                prev = current;
            }
        }
    }
    return newArray;
};
Array.prototype.FindIndex = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        for (var i = 0; i < that.length; i++) {
            var obj = that[i];
            if (filter(obj) == true) {
                return i;
            }
        }
        return -1;
    }
    else {
        throw "Linq4JS: You must define a filter";
    }
};
Array.prototype.First = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
    else {
        if (that.Any()) {
            return that.Get(0);
        }
        else {
            throw "Linq4JS: The First Entry was not found";
        }
    }
};
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
Array.prototype.ForEach = function (action) {
    var that = this;
    var actionFunction = Linq4JS.Helper.ConvertFunction(action);
    for (var _i = 0, that_2 = that; _i < that_2.length; _i++) {
        var obj = that_2[_i];
        var result = actionFunction(obj);
        if (result != null && result == true) {
            break;
        }
    }
    return that;
};
Array.prototype.Get = function (index) {
    var that = this;
    return that[index];
};
Array.prototype.GroupBy = function (selector) {
    var that = this;
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selector);
    var newArray = new Array();
    var ordered = that.OrderBy(selectorFunction);
    var prev;
    var newSub = new Array();
    ordered.ForEach(function (x) {
        if (prev != null) {
            if (selectorFunction(prev) != selectorFunction(x)) {
                newArray.Add(newSub);
                newSub = new Array();
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
Array.prototype.Insert = function (object, index) {
    var that = this;
    that.splice(index, 0, object);
    return that;
};
Array.prototype.Join = function (char, selector) {
    var that = this;
    var array = that;
    if (selector != null) {
        array = array.Select(selector);
    }
    return array.join(char);
};
Array.prototype.Last = function (filter) {
    var that = this;
    if (filter != null) {
        var result = that.Where(filter);
        if (result.Any()) {
            return result.Get(result.length - 1);
        }
        else {
            throw "Linq4JS: The Last Entry was not found";
        }
    }
    else {
        if (that.Any()) {
            return that.Get(that.length - 1);
        }
        else {
            throw "Linq4JS: The Last Entry was not found";
        }
    }
};
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
Array.prototype.Move = function (oldIndex, newIndex) {
    var that = this;
    that.splice(newIndex, 0, that.splice(oldIndex, 1)[0]);
    return that;
};
Array.prototype.OrderBy = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = that.Clone();
    ordered.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, false);
    });
};
Array.prototype.OrderByDescending = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    var ordered = that.Clone();
    ordered.Order = new Array(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        return Linq4JS.Helper.OrderCompareFunction(valueSelectorFunction, a, b, true);
    });
};
Array.prototype.Range = function (start, length) {
    var that = this;
    var newArray = new Array();
    for (var i = start; i < start + length; i++) {
        newArray.Add(that.Get(i));
    }
    return newArray;
};
Array.prototype.Remove = function (object, primaryKeySelector) {
    var that = this;
    var targetIndex;
    if (object == null) {
        throw "Linq4JS: The object cannot be null";
    }
    if (primaryKeySelector != null) {
        var selector_1 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = that.FindIndex(function (x) {
            return selector_1(x) == selector_1(object);
        });
    }
    else if (object["Id"] != null) {
        targetIndex = that.FindIndex(function (x) {
            return x["Id"] == object["Id"];
        });
    }
    else {
        targetIndex = that.FindIndex(function (x) {
            return x == object;
        });
    }
    if (targetIndex != -1) {
        that.splice(targetIndex, 1);
    }
    else {
        throw "Linq4JS: Nothing found to Remove";
    }
    return that;
};
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
Array.prototype.Reverse = function () {
    var that = this;
    return that.reverse();
};
Array.prototype.Select = function (selector) {
    var that = this;
    var selectorFunction = Linq4JS.Helper.ConvertFunction(selector);
    var newArray = new Array();
    for (var _i = 0, that_3 = that; _i < that_3.length; _i++) {
        var obj = that_3[_i];
        newArray.Add(selectorFunction(obj));
    }
    return newArray;
};
Array.prototype.Skip = function (count) {
    var that = this;
    return that.slice(count, that.Count());
};
Array.prototype.Sum = function (selector, filter) {
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
    return result;
};
Array.prototype.Take = function (count) {
    var that = this;
    return that.slice(0, count);
};
Array.prototype.ThenBy = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    if (that.Order == null || that.Order.Count() == 0) {
        throw "Linq4JS: Please call OrderBy or OrderByDescending before ThenBy";
    }
    var ordered = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Ascending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction == Linq4JS.OrderDirection.Descending);
            if (result != 0) {
                return result;
            }
        }
        return 0;
    });
};
Array.prototype.ThenByDescending = function (valueSelector) {
    var that = this;
    var valueSelectorFunction = Linq4JS.Helper.ConvertFunction(valueSelector);
    if (that.Order == null || that.Order.Count() == 0) {
        throw "Linq4JS: Please call OrderBy or OrderByDescending before ThenByDescending";
    }
    var ordered = that;
    ordered.Order.Add(new Linq4JS.OrderEntry(Linq4JS.OrderDirection.Descending, valueSelectorFunction));
    return ordered.sort(function (a, b) {
        for (var _i = 0, _a = ordered.Order; _i < _a.length; _i++) {
            var entry = _a[_i];
            var result = Linq4JS.Helper.OrderCompareFunction(entry.ValueSelector, a, b, entry.Direction == Linq4JS.OrderDirection.Descending);
            if (result != 0) {
                return result;
            }
        }
        return 0;
    });
};
Array.prototype.Update = function (object, primaryKeySelector) {
    var that = this;
    var targetIndex;
    if (object == null) {
        throw "Linq4JS: The object cannot be null";
    }
    if (primaryKeySelector != null) {
        var selector_3 = Linq4JS.Helper.ConvertFunction(primaryKeySelector);
        targetIndex = that.FindIndex(function (x) {
            return selector_3(x) == selector_3(object);
        });
    }
    else if (object["Id"] != null) {
        targetIndex = that.FindIndex(function (x) {
            return x["Id"] == object["Id"];
        });
    }
    else {
        targetIndex = that.FindIndex(function (x) {
            return x == object;
        });
    }
    if (targetIndex != -1) {
        var keys = Object.keys(object);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key != "Id") {
                that[targetIndex][key] = object[key];
            }
        }
    }
    else {
        throw "Linq4JS: Nothing found to Update";
    }
    return that;
};
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
Array.prototype.Where = function (filter) {
    var that = this;
    if (filter != null) {
        var filterFunction = Linq4JS.Helper.ConvertFunction(filter);
        var newArray = new Array();
        for (var i = 0; i < that.length; i++) {
            var obj = that[i];
            if (filterFunction(obj) == true) {
                newArray.push(obj);
            }
        }
        return newArray;
    }
    else {
        throw "Linq4JS: You must define a filter";
    }
};
