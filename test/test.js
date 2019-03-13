"use strict";
var User = /** @class */ (function () {
    function User(_id, _firstName, _name, _age) {
        this.Id = _id;
        this.FirstName = _firstName;
        this.Name = _name;
        this.Age = _age;
    }
    return User;
}());
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
describe("Aggregate", function () {
    it("numbers", function () {
        var result = Users.Aggregate(function (x, y) { return x + y.Age; }, 0);
        expect(result).toBe(822);
    });
});
describe("All", function () {
    it("not null", function () {
        expect(Users.All(function (x) { return x != null; })).toBe(true);
    });
});
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
describe("Average", function () {
    it("numbers", function () {
        var result = Users.Average(function (x) { return x.Age; });
        expect(result).toBe(51.375);
    });
});
describe("Clone", function () {
    it("users", function () {
        var result = Users.Clone();
        expect(result).toEqual(Users);
    });
});
describe("Concat", function () {
    it("users", function () {
        var result = Users.Concat([new User(1, "test", "test", 12)]);
        expect(result.Count()).toEqual(Users.Count() + 1);
    });
});
describe("Contains", function () {
    it("users", function () {
        var result = Users.Contains(Users[3]);
        expect(result).toBe(true);
    });
});
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
describe("Distinct", function () {
    it("numbers", function () {
        expect(Numbers.Distinct().Count()).toBe(13);
    });
    it("booleans", function () {
        expect(Booleans.Distinct().Count()).toBe(2);
    });
});
describe("Evaluate", function () {
    it("users", function () {
        var result = Users.Evaluate("select x => x.Id");
        expect(result).toEqual(Users.Select(function (x) { return x.Id; }));
    });
});
describe("FindIndex", function () {
    it("users", function () {
        var result = Users.FindIndex(function (u) { return u.Id === 3; });
        expect(result).toBe(2);
    });
});
describe("FindLastIndex", function () {
    it("users", function () {
        var result = Users.Add(Users[2]).FindLastIndex(function (u) { return u.Id === 3; });
        expect(result).toBe(16);
    });
});
describe("First", function () {
    it("users", function () {
        expect(Users.First()).toEqual(Users[0]);
        expect(Users.First(function (u) { return u.Id === 3; })).toEqual(Users[2]);
        expect(function () {
            Users.First(function (u) { return u.Id === 0; });
        }).toThrow();
    });
});
describe("FirstOrDefault", function () {
    it("users", function () {
        expect(Users.FirstOrDefault()).toEqual(Users[0]);
        expect(Users.FirstOrDefault(function (u) { return u.Id === 3; })).toEqual(Users[2]);
        expect(Users.FirstOrDefault(function (u) { return u.Id === 0; })).toBe(null);
    });
});
describe("ForEach", function () {
    it("users", function () {
        var result = 0;
        Users.ForEach(function (u) {
            result += u.Id;
        });
        expect(result).toEqual(136);
    });
});
describe("Get", function () {
    it("users", function () {
        expect(Users.Get(3)).toEqual(Users[3]);
    });
});
describe("GroupBy", function () {
    it("users age", function () {
        var grouped = Users.GroupBy(function (g) { return g.Age; });
        expect(grouped.Count()).toEqual(16);
        expect(grouped.All(function (g) { return g.All(function (v) { return v.Age === g._linq4js_.GroupValue; }); })).toBe(true);
    });
    it("users name", function () {
        var grouped = Users.GroupBy(function (g) { return g.Name; });
        expect(grouped.Count()).toEqual(15);
        expect(grouped.All(function (g) { return g.All(function (v) { return v.Name === g._linq4js_.GroupValue; }); })).toBe(true);
    });
});
describe("Insert", function () {
    it("users", function () {
        Users.Insert("Test", 3);
        expect(Users[3]).toEqual("Test");
    });
});
describe("Intersect", function () {
    it("users", function () {
        expect(Users.Intersect(Users.Skip(5).Take(10))).toEqual(Users.Skip(5).Take(10));
    });
});
describe("Join", function () {
    it("users", function () {
        expect(Users.Join("t"))
            .toEqual("[object Object]t[object Object]t[object Object]t[object Object]t[object Object]t[object Object]" +
            "t[object Object]t[object Object]t[object Object]t[object Object]t[object Object]t[object Object]" +
            "t[object Object]t[object Object]t[object Object]t[object Object]");
    });
});
describe("Last", function () {
    it("users", function () {
        expect(Users.Last()).toEqual(Users[Users.length - 1]);
        expect(Users.Last(function (u) { return u.Id === 3; })).toEqual(Users[2]);
        expect(function () {
            Users.Last(function (u) { return u.Id === 0; });
        }).toThrow();
    });
});
describe("LastOrDefault", function () {
    it("users", function () {
        expect(Users.LastOrDefault()).toEqual(Users[Users.length - 1]);
        expect(Users.LastOrDefault(function (u) { return u.Id === 3; })).toEqual(Users[2]);
        expect(Users.FirstOrDefault(function (u) { return u.Id === 0; })).toBe(null);
    });
});
describe("Max", function () {
    it("numbers", function () {
        expect(Numbers.Max()).toBe(1000);
    });
});
describe("Min", function () {
    it("numbers", function () {
        expect(Numbers.Min()).toBe(-10);
    });
});
describe("Move", function () {
    it("users", function () {
        var newUsers = Users.Clone().Move(0, 4);
        expect(newUsers[4]).toEqual(Users[0]);
    });
});
describe("OrderBy", function () {
    it("users", function () {
        expect(Users.OrderBy(function (u) { return u.Age; }).Last()).toEqual(Users[9]);
    });
});
describe("OrderByDescending", function () {
    it("users", function () {
        expect(Users.OrderByDescending(function (u) { return u.Age; }).Last()).toEqual(Users[7]);
    });
});
describe("Range", function () {
    it("users", function () {
        var range = Users.Range(5, 4);
        expect(range.length).toBe(4);
        expect(range[0]).toEqual(Users[5]);
        expect(range[1]).toEqual(Users[6]);
        expect(range[2]).toEqual(Users[7]);
        expect(range[3]).toEqual(Users[8]);
    });
});
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
describe("Repeat", function () {
    it("users", function () {
        var array = [].Repeat(5, 10);
        expect(array.length).toBe(10);
        expect(array.All(function (v) { return v === 5; })).toBe(true);
    });
});
describe("Reverse", function () {
    it("users", function () {
        var arrayReversed = Users.Reverse();
        expect(arrayReversed.length).toBe(Users.length);
        expect(arrayReversed[arrayReversed.length - 1]).toEqual(Users[0]);
        expect(arrayReversed[0]).toEqual(Users[Users.length - 1]);
    });
});
describe("Select", function () {
    it("name", function () {
        var selection = Users.Select(function (u) { return u.FirstName; });
        expect(selection.Count()).toBe(16);
        expect(typeof selection[0]).toBe("string");
    });
});
describe("SelectMany", function () {
    it("name", function () {
        var selection = [Users, Users].SelectMany(function (u) { return u; });
        expect(selection.Count()).toBe(32);
        expect(typeof selection[0]).toBe("object");
    });
});
describe("SequenceEqual", function () {
    it("name", function () {
        expect(Users.SequenceEqual(Users)).toBeTruthy();
        expect(Users.SequenceEqual(Users.Skip(1))).toBeFalsy();
        expect(Users.SequenceEqual(Fruits)).toBeFalsy();
    });
});
describe("Single", function () {
    it("user", function () {
        expect(function () {
            Users.Single();
        }).toThrow();
        expect(function () {
            [].Single();
        }).toThrow();
        expect(Users.Skip(15).Single()).toEqual(Users[15]);
    });
});
describe("SingleOrDefault", function () {
    it("user", function () {
        expect(function () {
            Users.SingleOrDefault();
        }).toThrow();
        expect([].SingleOrDefault()).toBe(null);
        expect(Users.Skip(15).SingleOrDefault()).toEqual(Users[15]);
    });
});
describe("Skip", function () {
    it("user", function () {
        var result = Users.Skip(5);
        expect(result.length).toBe(11);
        expect(result[0]).toEqual(Users[5]);
    });
});
describe("Sum", function () {
    it("user", function () {
        var result = Users.Sum(function (x) { return x.Age; });
        expect(result).toBe(822);
    });
});
describe("Take", function () {
    it("user", function () {
        var result = Users.Take(5);
        expect(result.length).toBe(5);
        expect(result[0]).toEqual(Users[0]);
    });
});
describe("TakeWhile", function () {
    it("user", function () {
        var result = Users.TakeWhile(function (x) { return x.Id < 10; });
        expect(result.length).toBe(9);
        expect(result[8].Id).toBe(9);
    });
});
describe("ThenBy", function () {
    it("users", function () {
        expect(function () {
            Users.ThenBy(function (x) { return x.Age; });
        }).toThrow();
        var sorted = Users.OrderBy(function (u) { return u.Name; }).ThenBy(function (u) { return u.Age; });
        expect(sorted[5].Id).toBe(16);
        expect(sorted[6].Id).toBe(2);
    });
});
describe("ThenBy", function () {
    it("users", function () {
        expect(function () {
            Users.ThenByDescending(function (x) { return x.Age; });
        }).toThrow();
        var sorted = Users.OrderBy(function (u) { return u.Name; }).ThenByDescending(function (u) { return u.Age; });
        expect(sorted[6].Id).toBe(16);
        expect(sorted[5].Id).toBe(2);
    });
});
describe("ToDictionary", function () {
    it("name", function () {
        var dictionary = Users.ToDictionary(function (x) { return x.Name; }, function (x) { return x.Id; });
        expect(Object.keys(dictionary).length).toBe(15);
        expect(dictionary.Thompson).toBe(1);
    });
});
describe("Union", function () {
    it("users", function () {
        expect(Users.Union(Users).Count()).toEqual(16);
    });
});
describe("Update", function () {
    it("users", function () {
        expect(Users[0].Age).toEqual(49);
        var user = Users.FirstOrDefault();
        user.Age = 12;
        Users.Update(user, function (x) { return x.Id; });
        expect(Users[0].Age).toEqual(12);
    });
});
describe("UpdateRange", function () {
    it("users", function () {
        expect(Users[0].Age).toEqual(49);
        expect(Users[1].Age).toEqual(62);
        var user = Users.FirstOrDefault();
        user.Age = 12;
        var user2 = Users.Skip(1).FirstOrDefault();
        user2.Age = 13;
        Users.UpdateRange([user, user2], function (x) { return x.Id; });
        expect(Users[0].Age).toEqual(12);
        expect(Users[1].Age).toEqual(13);
    });
});
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
describe("Zip", function () {
    it("name", function () {
        var selection = Users.Take(10).Zip(Fruits.Take(10), function (x, y) { return x.Name + y; });
        expect(selection[0]).toBe("ThompsonBanana");
    });
});
