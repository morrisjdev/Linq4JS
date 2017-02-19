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