QUnit.module("Remove");

QUnit.test("apple", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    array.Remove("Apple");
    x.equal(array.Count(), 7, "Count is 7");
});

QUnit.test("unknown", x => {
    let array = getStringArray();
    x.equal(array.Count(), 8, "Count is 8");
    x.throws(function(){
        array.Remove("unknown");
    }, /Linq4JS/);
    x.equal(array.Count(), 8, "Count is 8");
});

QUnit.test("63", x => {
    let array = getNumberArray();
    x.equal(array.Count(), 14, "Count is 14");
    array.Remove(63);
    x.equal(array.Count(), 13, "Count is 13");
});

QUnit.test("user", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Remove(array[3]);
    x.equal(array.Count(), 15, "Count is 15");
});

QUnit.test("keyselector", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    array.Remove(array[3], x => x.Id);
    x.equal(array.Count(), 15, "Count is 15");
});

QUnit.test("null", x => {
    let array = getUserArray();
    x.equal(array.Count(), 16, "Count is 16");
    x.throws(function(){
        array.Remove(null);
    }, /Linq4JS/);
    x.equal(array.Count(), 16, "Count is 16");
});