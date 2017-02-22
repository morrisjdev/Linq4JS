"use strict";
var User = (function () {
    function User(_id, _firstName, _name, _age) {
        this.Id = _id;
        this.FirstName = _firstName;
        this.Name = _name;
        this.Age = _age;
    }
    return User;
}());
"use strict";
var Users = [];
var Fruits = [];
var Numbers = [];
var Booleans = [];
beforeEach(function () {
    Users = [
        new User(1, "Brenda", "Thompson", 49),
        new User(2, "Kelly", "Grady", 62),
        new User(3, "Lavina", "Baskin", 34),
        new User(4, "Corey", "Medina", 53),
        new User(5, "Walter", "Pankey", 61),
        new User(6, "Virginia", "Ayala", 54),
        new User(7, "Allison", "Israel", 38),
        new User(8, "Christine", "Starkey", 19),
        new User(9, "Robert", "Humphreys", 22),
        new User(10, "Daniel", "Stanley", 85),
        new User(11, "Frank", "Brown", 73),
        new User(12, "Juan", "Barnhart", 56),
        new User(13, "Timothy", "Olson", 29),
        new User(14, "Christina", "Holland", 81),
        new User(15, "Albert", "Dunn", 58),
        new User(16, "Kelly", "Grady", 48)
    ];
    Fruits = [
        "Banana",
        "Apple",
        "Pineapple",
        "Coconut",
        "Strawberry",
        "Melon",
        "Apricot",
        "Peach",
        "Nectarine",
        "Pear",
        "Quince",
        "Lemon",
        "Orange",
        "Mandarin",
        "Cherry"
    ];
    Numbers = [
        76, 122, 63, 782, 85, 87, 55, 63, 35, 1, -10, 63.2, 627, 1000
    ];
    Booleans = [
        true, false, false, true, false, true, true, false, false, false, true
    ];
});
"use strict";
describe("Function Converter", function () {
    it("correct string", function () {
        expect(function () {
            Linq4JS.Helper.ConvertFunction("x => x");
        }).not.toThrow();
    });
    it("empty string", function () {
        expect(function () {
            Linq4JS.Helper.ConvertFunction("");
        }).toThrow();
    });
    it("number", function () {
        expect(function () {
            Linq4JS.Helper.ConvertFunction(12);
        }).toThrow();
    });
    it("false string", function () {
        expect(function () {
            Linq4JS.Helper.ConvertFunction("x = x.age");
        }).toThrow();
    });
});
"use strict";
describe("Add", function () {
    it("string", function () {
        Fruits.Add("Fruit");
        expect(Fruits.Count()).toBe(16);
    });
    it("number", function () {
        Numbers.Add(12);
        expect(Numbers.Count()).toBe(15);
    });
    it("user", function () {
        Users.Add(new User(5, "Walter", "Pankey", 61));
        expect(Users.Count()).toBe(17);
    });
    it("null", function () {
        Users.Add(null);
        expect(Users.Count()).toBe(16);
    });
    it("auto generate", function () {
        var newUser = new User(5, "Walter", "Pankey", 61);
        Users.Add(newUser, true);
        expect(Users.Count()).toBe(17);
        expect(newUser._GeneratedId_).toBe(1);
        var newUser2 = new User(5, "Walter", "Pankey", 61);
        Users.Add(newUser2, true);
        expect(Users.Count()).toBe(18);
        expect(newUser2._GeneratedId_).toBe(2);
    });
});
"use strict";
describe("AddRange", function () {
    it("strings", function () {
        Fruits.AddRange(["Fruit", "another Fruit"]);
        expect(Fruits.Count()).toBe(17);
    });
    it("numbers", function () {
        Numbers.AddRange([12, 13]);
        expect(Numbers.Count()).toBe(16);
    });
    it("users", function () {
        Users.AddRange([new User(5, "Walter", "Pankey", 61), new User(6, "Walter", "Pankey", 61)]);
        expect(Users.Count()).toBe(18);
    });
    it("null", function () {
        Users.AddRange([null, null]);
        expect(Users.Count()).toBe(16);
    });
    it("auto generate", function () {
        var newUser = new User(5, "Walter", "Pankey", 61);
        var newUser2 = new User(5, "Walter", "Pankey", 61);
        Users.AddRange([newUser, newUser2], true);
        expect(Users.Count()).toBe(18);
        expect(newUser._GeneratedId_).toBe(1);
        expect(newUser2._GeneratedId_).toBe(2);
    });
});
"use strict";
describe("Any", function () {
    it("any", function () {
        expect(Users.Any()).toBe(true);
    });
    it("age > 70", function () {
        expect(Users.Any(function (x) { return x.Age > 70; })).toBe(true);
    });
    it("age > 70 (string)", function () {
        expect(Users.Any("x => x.Age > 70")).toBe(true);
    });
    it("age > 90", function () {
        expect(Users.Any(function (x) { return x.Age > 90; })).toBe(false);
    });
    it("age > 90 (string)", function () {
        expect(Users.Any("x => x.Age > 90")).toBe(false);
    });
    it("age < 18", function () {
        expect(Users.Any(function (x) { return x.Age < 18; })).toBe(false);
    });
    it("age < 18 (string)", function () {
        expect(Users.Any("x => x.Age < 18")).toBe(false);
    });
});
"use strict";
describe("Count", function () {
    it("all", function () {
        expect(Users.Count()).toBe(16);
    });
    it("age > 80", function () {
        expect(Users.Count(function (x) { return x.Age > 80; })).toBe(2);
    });
    it("age > 80 (string)", function () {
        expect(Users.Count("x => x.Age > 80")).toBe(2);
    });
    it("age < 18", function () {
        expect(Users.Count(function (x) { return x.Age < 18; })).toBe(0);
    });
    it("age < 18 (string)", function () {
        expect(Users.Count("x => x.Age < 18")).toBe(0);
    });
});
"use strict";
describe("Distinct", function () {
    it("numbers", function () {
        expect(Numbers.Distinct().Count()).toBe(13);
    });
    it("booleans", function () {
        expect(Booleans.Distinct().Count()).toBe(2);
    });
});
"use strict";
describe("Remove", function () {
    it("apple", function () {
        expect(Fruits.Remove("Apple").Count()).toBe(14);
    });
    it("unknown", function () {
        expect(function () {
            Fruits.Remove("unknown");
        }).toThrow();
        expect(Fruits.Count()).toBe(15);
    });
    it("63", function () {
        expect(Numbers.Remove(63).Count()).toBe(13);
    });
    it("user", function () {
        expect(Users.Remove(Users[3]).Count()).toBe(15);
    });
    it("user keyselector", function () {
        expect(Users.Remove(Users[3], function (x) { return x.Id; }).Count()).toBe(15);
    });
    it("null", function () {
        expect(function () {
            Users.Remove(null);
        }).toThrow();
        expect(Users.Count()).toBe(16);
    });
});
"use strict";
describe("RemoveRange", function () {
    it("apple, banana", function () {
        expect(Fruits.RemoveRange(["Apple", "Banana"]).Count()).toBe(13);
    });
    it("unknown, apple", function () {
        expect(function () {
            Fruits.RemoveRange(["unknown", "Apple"]);
        }).toThrow();
    });
    it("apple, unknown", function () {
        expect(function () {
            Fruits.RemoveRange(["Apple", "unknown"]);
        }).toThrow();
    });
    it("63, 63", function () {
        expect(Numbers.RemoveRange([63, 63]).Count()).toBe(12);
    });
    it("users", function () {
        expect(Users.RemoveRange(Users.Range(2, 2)).Count()).toBe(14);
    });
    it("users keyselector", function () {
        expect(Users.RemoveRange(Users.Range(2, 2), function (x) { return x.Id; }).Count()).toBe(14);
    });
    it("nulls", function () {
        expect(function () {
            Users.RemoveRange([null, null]);
        }).toThrow();
    });
});
"use strict";
describe("Where", function () {
    it("age > 70", function () {
        expect(Users.Where(function (x) { return x.Age > 70; }).Count()).toEqual(3);
    });
    it("age > 70 (string)", function () {
        expect(Users.Where("x => x.Age > 70").Count()).toEqual(3);
    });
    it("age > 70 && id > 10", function () {
        expect(Users.Where(function (x) { return x.Age > 70 && x.Id > 10; }).Count()).toEqual(2);
    });
    it("age > 70 && id > 10 (string)", function () {
        expect(Users.Where("x => x.Age > 70 && x.Id > 10").Count()).toEqual(2);
    });
    it("age > 70 && firstname.length > 6", function () {
        expect(Users.Where(function (x) { return x.Age > 70 && x.FirstName.length > 6; }).Count()).toEqual(1);
    });
    it("age > 70 && firstname.length > 6 (string)", function () {
        expect(Users.Where("x => x.Age > 70 && x.FirstName.length > 6").Count()).toEqual(1);
    });
    it("name contains 'in'", function () {
        expect(Users.Where(function (x) { return x.FirstName.match(/in/) != null; }).Count()).toEqual(4);
    });
    it("name contains 'in' (string)", function () {
        expect(Users.Where("x => x.FirstName.match(/in/) != null").Count()).toEqual(4);
    });
});
