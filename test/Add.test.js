/// <reference path="../bower_components/qunit/qunit.js" />
/// <reference path="../dist/Linq4JS.js" />
/// <reference path="TestClasses.js" />
/// <reference path="Linq4JS.test.js" />

QUnit.module("Add & AddRange");

QUnit.test("Add normal", function (assert) {
    var newArr = testArray.Clone();
    newArr.Add(new Linq4JS.Test.User(17, "Morris", "Janatzek", 18));

    assert.equal(newArr.Count(), 17);
});

QUnit.test("Add null", function (assert) {
    var newArr = testArray.Clone();
    newArr.Add(null);

    assert.equal(newArr.Count(), 16);
});

QUnit.test("Add no parameter", function (assert) {
    var newArr = testArray.Clone();
    newArr.Add();

    assert.equal(newArr.Count(), 16);
});

QUnit.test("AddRange normal", function (assert) {
    var newArr = testArray.Clone();
    newArr.AddRange([new Linq4JS.Test.User(17, "Morris", "Janatzek", 18), new Linq4JS.Test.User(18, "Max", "Mustermann", 56)]);

    assert.equal(newArr.Count(), 18);
});

QUnit.test("AddRange null", function (assert) {
    var newArr = testArray.Clone();
    newArr.AddRange([null, null]);

    assert.equal(newArr.Count(), 16);
});

QUnit.test("AddRange empty array", function (assert) {
    var newArr = testArray.Clone();
    newArr.AddRange([]);

    assert.equal(newArr.Count(), 16);
});