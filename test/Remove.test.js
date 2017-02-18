/// <reference path="../bower_components/qunit/qunit.js" />
/// <reference path="../dist/Linq4JS.js" />
/// <reference path="TestClasses.js" />
/// <reference path="Linq4JS.test.js" />

QUnit.module("Remove & RemoveRange");

QUnit.test("Remove normal", function (assert) {
    var newArr = testArray.Clone();
    newArr.Remove(new Linq4JS.Test.User(14, "Christina", "Holland", 81));
    assert.equal(newArr.Count(), 15);
});

QUnit.test("Remove age as key", function (assert) {
    var newArr = testArray.Clone();
    newArr.Remove(new Linq4JS.Test.User(14, "Christina", "Holland", 81), "u => u.Age");
    assert.equal(newArr.Count(), 15);
});

QUnit.test("Remove null", function (assert) {
    var newArr = testArray.Clone();

    assert.throws(function () {
        newArr.Remove(null);
    }, /Linq4JS/);
});

QUnit.test("Remove not in array", function (assert) {
    var newArr = testArray.Clone();

    assert.throws(function () {
        newArr.Remove(new Linq4JS.Test.User(77, "Christina", "Holland", 81));
    }, /Linq4JS/);
});

QUnit.test("Remove wrong key", function (assert) {
    var newArr = testArray.Clone();

    assert.throws(function () {
        newArr.Remove(new Linq4JS.Test.User(14, "Christina", "Holland", 81), "u, x => u.Age");
    }, /Linq4JS/);
});

QUnit.test("RemoveRange null", function (assert) {
    var newArr = testArray.Clone();

    assert.throws(function () {
        newArr.Remove([null, null]);
    }, /Linq4JS/);
});