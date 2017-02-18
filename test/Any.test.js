/// <reference path="../bower_components/qunit/qunit.js" />
/// <reference path="../dist/Linq4JS.js" />
/// <reference path="TestClasses.js" />
/// <reference path="Linq4JS.test.js" />

QUnit.module("Any");

QUnit.test("Any Age > 70", function (assert) {
    assert.equal(testArray.Any("u => u.Age > 70"), true);
});

QUnit.test("Any Age > 90", function (assert) {
    assert.equal(testArray.Any("u => u.Age > 90"), false);
});

QUnit.test("Any Age < 18", function (assert) {
    assert.equal(testArray.Any("u => u.Age < 18"), false);
});