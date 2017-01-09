/// <reference path="../Frameworks/qunit/qunit.js" />
/// <reference path="../Scripts/Linq4JS.js" />
/// <reference path="TestClasses.js" />
/// <reference path="Linq4JS.test.js" />

QUnit.module("Count");

QUnit.test("Count all", function (assert) {
    assert.equal(testArray.Count(), 16);
});

QUnit.test("Count Age > 80", function (assert) {
    assert.equal(testArray.Count("u => u.Age > 80"), 2);
});

QUnit.test("Count filter false string", function (assert) {
    assert.throws(function () {
        testArray.Count("x, y => x.Age > 80");
    }, /Linq4JS/);
});

QUnit.test("Count filter empty string", function (assert) {
    assert.throws(function () {
        testArray.Count("");
    }, /Linq4JS/);
});