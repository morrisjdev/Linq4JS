QUnit.module("Add");

QUnit.test("string", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.Add("Fruit");
    x.equal(array.Count(), 9, "Count is 9");
});

QUnit.test("number", x => {
    let array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.Add(12);
    x.equal(array.Count(), 15, "Count is 15");
});

QUnit.test("user", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Add(getNewUser());
    x.equal(array.Count(), 17, "Count is 17");
});

QUnit.test("null", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Add(null);
    x.equal(array.Count(), 16, "Count is 16");
});

QUnit.test("user autogenerate", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    let newUser = getNewUser();
    array.Add(newUser, true);
    x.equal(array.Count(), 17, "Count is 17");
    x.equal(((newUser as any) as Linq4JS.GeneratedEntity)._GeneratedId_, 1, "Auto Generated ID is 1");
});