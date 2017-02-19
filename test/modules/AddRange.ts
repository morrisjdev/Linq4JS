QUnit.module("AddRange");

QUnit.test("strings", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.AddRange(["Fruit2", "test"]);
    x.equal(array.Count(), 10, "Count is 10");
});

QUnit.test("numbers", x => {
    let array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.AddRange([12, 13]);
    x.equal(array.Count(), 16, "Count is 16");
});

QUnit.test("users", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.AddRange([getNewUser(), getNewUser()]);
    x.equal(array.Count(), 18, "Count is 18");
});

QUnit.test("nulls", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.AddRange([null, null]);
    x.equal(array.Count(), 16, "Count is 16");
});

QUnit.test("users autogenerate", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    let newUser1 = getNewUser();
    let newUser2 = getNewUser();
    array.AddRange([newUser1, newUser2], true);
    x.equal(array.Count(), 18, "Count is 18");
    x.equal(((newUser1 as any) as Linq4JS.GeneratedEntity)._GeneratedId_, 1, "Auto Generated ID of newUser1 is 1");
    x.equal(((newUser2 as any) as Linq4JS.GeneratedEntity)._GeneratedId_, 2, "Auto Generated ID of newUser2 is 2");
});