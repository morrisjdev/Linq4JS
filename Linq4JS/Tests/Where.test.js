/// <reference path="../lib/qunit/qunit.js" />
/// <reference path="../dist/Linq4JS.js" />
/// <reference path="TestClasses.js" />
/// <reference path="Linq4JS.test.js" />

QUnit.module("Where");

QUnit.test("Where Age > 70 Function", function (assert) {
    var result = testArray.Where(function (u) {
        return u.Age > 70;
    });
    assert.equal(result.Count(), 3);
});

QUnit.test("Where Age > 70 Lambda String", function (assert) {
    var result = testArray.Where("u => u.Age > 70");
    assert.equal(result.Count(), 3);
});

QUnit.test("Where Age > 90 Lambda String", function (assert) {
    var result = testArray.Where("u => u.Age > 90");
    assert.equal(result.Count(), 0);
});

QUnit.test("Where Age < 0 Lambda String", function (assert) {
    var result = testArray.Where("u => u.Age < 0");
    assert.equal(result.Count(), 0);
});


QUnit.test("Where Age > 80 && Id > 10 Lambda String", function (assert) {
    var result = testArray.Where("u => u.Age > 80 && u.Id > 10");
    assert.equal(result.Count(), 1);
});

QUnit.test("Where no filter", function (assert) {
    assert.throws(function () {
        testArray.Where();
    }, /Linq4JS/);
});

QUnit.test("Where filter empty string", function (assert) {
    assert.throws(function () {
        testArray.Where("");
    }, /Linq4JS/);
});

QUnit.test("Where filter false string", function (assert) {
    assert.throws(function () {
        testArray.Where("x, y => x.Id > 70");
    }, /Linq4JS/);
});