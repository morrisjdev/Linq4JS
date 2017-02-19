QUnit.module("RemoveRange");

QUnit.test("apple, banana", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.RemoveRange(["Apple", "Banana"]);
    x.equal(array.Count(), 6, "Count is 6");
});

QUnit.test("unknown, apple", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    x.throws(function(){
        array.RemoveRange(["unknown", "Apple"]);
    }, /Linq4JS/);
    x.equal(array.Count(), 8, "Count is 8");
});

QUnit.test("apple, unknown", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    x.throws(function(){
        array.RemoveRange(["Apple", "unknown"]);
    }, /Linq4JS/);
    x.equal(array.Count(), 7, "Count is 7");
});

QUnit.test("63, 63", x => {
    let array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.RemoveRange([63, 63]);
    x.equal(array.Count(), 12, "Count is 12");
});

QUnit.test("users", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.RemoveRange(array.Range(2, 2));
    x.equal(array.Count(), 14, "Count is 14");
});

QUnit.test("keyselector", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.RemoveRange(array.Range(2, 2), x => x.Id);
    x.equal(array.Count(), 14, "Count is 14");
});

QUnit.test("nulls", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    x.throws(function(){
        array.RemoveRange([null, null]);
    }, /Linq4JS/);
    x.equal(array.Count(), 16, "Count is 16");
});