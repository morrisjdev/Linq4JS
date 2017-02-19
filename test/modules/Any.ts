QUnit.module("Any");

QUnit.test("any", x => {
    let array = getUserArray();
    x.equal(array.Any(), true, "Array contains any elements");
});

QUnit.test("age > 70", x => {
    let array = getUserArray();
    x.equal(array.Any(x => x.Age > 70), true, "Array contains elements with age > 70");
});

QUnit.test("age > 90", x => {
    let array = getUserArray();
    x.equal(array.Any(x => x.Age > 90), false, "Array contains no elements with age > 90");
});

QUnit.test("age < 18", x => {
    let array = getUserArray();
    x.equal(array.Any(x => x.Age < 18), false, "Array contains no elements with age < 18");
});

QUnit.module("Any string");

QUnit.test("any", x => {
    let array = getUserArray();
    x.equal(array.Any(), true, "Array contains any elements");
});

QUnit.test("age > 70", x => {
    let array = getUserArray();
    x.equal(array.Any("x => x.Age > 70"), true, "Array contains elements with age > 70");
});

QUnit.test("age > 90", x => {
    let array = getUserArray();
    x.equal(array.Any("x => x.Age > 90"), false, "Array contains no elements with age > 90");
});

QUnit.test("age < 18", x => {
    let array = getUserArray();
    x.equal(array.Any("x => x.Age < 18"), false, "Array contains no elements with age < 18");
});