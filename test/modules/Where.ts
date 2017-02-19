QUnit.module("Where");

QUnit.test("age > 70", x => {
    let array = getUserArray();
    x.equal(array.Where(x => x.Age > 70).Count(), 3, "Array contains 3 elements with age > 70");
});

QUnit.test("age > 80 && id > 10", x => {
    let array = getUserArray();
    x.equal(array.Where(x => x.Age > 80 && x.Id > 10).Count(), 1, "Array contains 1 element with age > 80 && id > 10");
});