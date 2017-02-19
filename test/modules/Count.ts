QUnit.module("Count");

QUnit.test("all", function (assert) {
    let array = getUserArray();
    assert.equal(array.Count(), 16, "Count is 16");
});

QUnit.test("age > 80", function (assert) {
    let array = getUserArray();
    assert.equal(array.Count(u => u.Age > 80), 2, "Count of age > 80 is 2");
});

QUnit.test("age < 18", function (assert) {
    let array = getUserArray();
    assert.equal(array.Count(u => u.Age < 18), 0, "Count of age < 18 is 0");
});

QUnit.module("Count string");

QUnit.test("all", function (assert) {
    let array = getUserArray();
    assert.equal(array.Count(), 16, "Count is 16");
});

QUnit.test("age > 80", function (assert) {
    let array = getUserArray();
    assert.equal(array.Count("u => u.Age > 80"), 2, "Count of age > 80 is 2");
});

QUnit.test("age < 18", function (assert) {
    let array = getUserArray();
    assert.equal(array.Count("u => u.Age < 18"), 0, "Count of age < 18 is 0");
});