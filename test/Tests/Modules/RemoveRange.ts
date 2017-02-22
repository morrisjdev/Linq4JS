describe("RemoveRange", function(){
    it("apple, banana", function(){
        expect(Fruits.RemoveRange(["Apple", "Banana"]).Count()).toBe(13);
    });

    it("unknown, apple", function(){
        expect(function(){
            Fruits.RemoveRange(["unknown", "Apple"]);
        }).toThrow();
    });

    it("apple, unknown", function(){
        expect(function(){
            Fruits.RemoveRange(["Apple", "unknown"]);
        }).toThrow();
    });

    it("63, 63", function(){
        expect(Numbers.RemoveRange([63, 63]).Count()).toBe(12);
    });

    it("users", function(){
        expect(Users.RemoveRange(Users.Range(2, 2)).Count()).toBe(14);
    });

    it("users keyselector", function(){
        expect(Users.RemoveRange(Users.Range(2, 2), x => x.Id).Count()).toBe(14);
    });

    it("nulls", function(){
        expect(function(){
            Users.RemoveRange([null, null]);
        }).toThrow();
    });
});