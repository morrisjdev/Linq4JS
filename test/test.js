"use strict";
QUnit.module("Function Converter");
QUnit.test("empty string", function (assert) {
    assert.throws(function () {
        Linq4JS.Helper.ConvertFunction("");
    }, /Linq4JS/);
});
QUnit.test("number", function (assert) {
    assert.throws(function () {
        Linq4JS.Helper.ConvertFunction(12);
    }, /Linq4JS/);
});
QUnit.test("false string", function (assert) {
    assert.throws(function () {
        Linq4JS.Helper.ConvertFunction("x = x.age");
    });
});
"use strict";
QUnit.module("Add");
QUnit.test("string", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.Add("Fruit");
    x.equal(array.Count(), 9, "Count is 9");
});
QUnit.test("number", function (x) {
    var array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.Add(12);
    x.equal(array.Count(), 15, "Count is 15");
});
QUnit.test("user", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Add(getNewUser());
    x.equal(array.Count(), 17, "Count is 17");
});
QUnit.test("null", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Add(null);
    x.equal(array.Count(), 16, "Count is 16");
});
QUnit.test("user autogenerate", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    var newUser = getNewUser();
    array.Add(newUser, true);
    x.equal(array.Count(), 17, "Count is 17");
    x.equal(newUser._GeneratedId_, 1, "Auto Generated ID is 1");
});
"use strict";
QUnit.module("AddRange");
QUnit.test("strings", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.AddRange(["Fruit2", "test"]);
    x.equal(array.Count(), 10, "Count is 10");
});
QUnit.test("numbers", function (x) {
    var array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.AddRange([12, 13]);
    x.equal(array.Count(), 16, "Count is 16");
});
QUnit.test("users", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.AddRange([getNewUser(), getNewUser()]);
    x.equal(array.Count(), 18, "Count is 18");
});
QUnit.test("nulls", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.AddRange([null, null]);
    x.equal(array.Count(), 16, "Count is 16");
});
QUnit.test("users autogenerate", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    var newUser1 = getNewUser();
    var newUser2 = getNewUser();
    array.AddRange([newUser1, newUser2], true);
    x.equal(array.Count(), 18, "Count is 18");
    x.equal(newUser1._GeneratedId_, 1, "Auto Generated ID of newUser1 is 1");
    x.equal(newUser2._GeneratedId_, 2, "Auto Generated ID of newUser2 is 2");
});
"use strict";
QUnit.module("Any");
QUnit.test("any", function (x) {
    var array = getUserArray();
    x.equal(array.Any(), true, "Array contains any elements");
});
QUnit.test("age > 70", function (x) {
    var array = getUserArray();
    x.equal(array.Any(function (x) { return x.Age > 70; }), true, "Array contains elements with age > 70");
});
QUnit.test("age > 90", function (x) {
    var array = getUserArray();
    x.equal(array.Any(function (x) { return x.Age > 90; }), false, "Array contains no elements with age > 90");
});
QUnit.test("age < 18", function (x) {
    var array = getUserArray();
    x.equal(array.Any(function (x) { return x.Age < 18; }), false, "Array contains no elements with age < 18");
});
QUnit.module("Any string");
QUnit.test("any", function (x) {
    var array = getUserArray();
    x.equal(array.Any(), true, "Array contains any elements");
});
QUnit.test("age > 70", function (x) {
    var array = getUserArray();
    x.equal(array.Any("x => x.Age > 70"), true, "Array contains elements with age > 70");
});
QUnit.test("age > 90", function (x) {
    var array = getUserArray();
    x.equal(array.Any("x => x.Age > 90"), false, "Array contains no elements with age > 90");
});
QUnit.test("age < 18", function (x) {
    var array = getUserArray();
    x.equal(array.Any("x => x.Age < 18"), false, "Array contains no elements with age < 18");
});
"use strict";
QUnit.module("Count");
QUnit.test("all", function (assert) {
    var array = getUserArray();
    assert.equal(array.Count(), 16, "Count is 16");
});
QUnit.test("age > 80", function (assert) {
    var array = getUserArray();
    assert.equal(array.Count(function (u) { return u.Age > 80; }), 2, "Count of age > 80 is 2");
});
QUnit.test("age < 18", function (assert) {
    var array = getUserArray();
    assert.equal(array.Count(function (u) { return u.Age < 18; }), 0, "Count of age < 18 is 0");
});
QUnit.module("Count string");
QUnit.test("all", function (assert) {
    var array = getUserArray();
    assert.equal(array.Count(), 16, "Count is 16");
});
QUnit.test("age > 80", function (assert) {
    var array = getUserArray();
    assert.equal(array.Count("u => u.Age > 80"), 2, "Count of age > 80 is 2");
});
QUnit.test("age < 18", function (assert) {
    var array = getUserArray();
    assert.equal(array.Count("u => u.Age < 18"), 0, "Count of age < 18 is 0");
});
"use strict";
QUnit.module("Remove");
QUnit.test("apple", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.Remove("Apple");
    x.equal(array.Count(), 7, "Count is 7");
});
QUnit.test("unknown", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    x.throws(function () {
        array.Remove("unknown");
    }, /Linq4JS/);
    x.equal(array.Count(), 8, "Count is 8");
});
QUnit.test("63", function (x) {
    var array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.Remove(63);
    x.equal(array.Count(), 13, "Count is 13");
});
QUnit.test("user", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Remove(array[3]);
    x.equal(array.Count(), 15, "Count is 15");
});
QUnit.test("keyselector", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Remove(array[3], function (x) { return x.Id; });
    x.equal(array.Count(), 15, "Count is 15");
});
QUnit.test("null", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    x.throws(function () {
        array.Remove(null);
    }, /Linq4JS/);
    x.equal(array.Count(), 16, "Count is 16");
});
"use strict";
QUnit.module("RemoveRange");
QUnit.test("apple, banana", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.RemoveRange(["Apple", "Banana"]);
    x.equal(array.Count(), 6, "Count is 6");
});
QUnit.test("unknown, apple", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    x.throws(function () {
        array.RemoveRange(["unknown", "Apple"]);
    }, /Linq4JS/);
    x.equal(array.Count(), 8, "Count is 8");
});
QUnit.test("apple, unknown", function (x) {
    var array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    x.throws(function () {
        array.RemoveRange(["Apple", "unknown"]);
    }, /Linq4JS/);
    x.equal(array.Count(), 7, "Count is 7");
});
QUnit.test("63, 63", function (x) {
    var array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.RemoveRange([63, 63]);
    x.equal(array.Count(), 12, "Count is 12");
});
QUnit.test("users", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.RemoveRange(array.Range(2, 2));
    x.equal(array.Count(), 14, "Count is 14");
});
QUnit.test("keyselector", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.RemoveRange(array.Range(2, 2), function (x) { return x.Id; });
    x.equal(array.Count(), 14, "Count is 14");
});
QUnit.test("nulls", function (x) {
    var array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    x.throws(function () {
        array.RemoveRange([null, null]);
    }, /Linq4JS/);
    x.equal(array.Count(), 16, "Count is 16");
});
"use strict";
QUnit.module("Where");
QUnit.test("age > 70", function (x) {
    var array = getUserArray();
    x.equal(array.Where(function (x) { return x.Age > 70; }).Count(), 3, "Array contains 3 elements with age > 70");
});
QUnit.test("age > 80 && id > 10", function (x) {
    var array = getUserArray();
    x.equal(array.Where(function (x) { return x.Age > 80 && x.Id > 10; }).Count(), 1, "Array contains 1 element with age > 80 && id > 10");
});
"use strict";
var User = (function () {
    function User(_id, _firstName, _name, _age) {
        this.Id = _id;
        this.FirstName = _firstName;
        this.Name = _name;
        this.Age = _age;
    }
    return User;
}());
var userArray = [
    new User(1, "Brenda", "Thompson", 49),
    new User(2, "Kelly", "Grady", 62),
    new User(3, "Lavina", "Baskin", 34),
    new User(4, "Corey", "Medina", 53),
    new User(5, "Walter", "Pankey", 61),
    new User(6, "Virginia", "Ayala", 54),
    new User(7, "Allison", "Israel", 38),
    new User(8, "Christine", "Starkey", 19),
    new User(9, "Robert", "Humphreys", 22),
    new User(10, "Daniel", "Stanley", 85),
    new User(11, "Frank", "Brown", 73),
    new User(12, "Juan", "Barnhart", 56),
    new User(13, "Timothy", "Olson", 29),
    new User(14, "Christina", "Holland", 81),
    new User(15, "Albert", "Dunn", 58),
    new User(16, "Kelly", "Grady", 48)
];
function getUserArray() {
    return userArray.Clone();
}
function getNewUser() {
    return new User(17, "Robert", "Dunnman", 32);
}
var stringArray = [
    "Banana", "Apple", "Pineapple", "Coconat", "banana", "Strawberry", "Melon", "Tomato"
];
function getStringArray() {
    return stringArray.Clone();
}
var numberArray = [
    76, 122, 63, 782, 85, 87, 55, 63, 35, 1, -10, 63.2, 627, 1000
];
function getNumberArray() {
    return numberArray.Clone();
}
