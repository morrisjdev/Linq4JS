describe("Any", function(){
    it("any", function(){
        expect(Users.Any()).toBe(true);
    });

    it("age > 70", function(){
        expect(Users.Any(x => x.Age > 70)).toBe(true);
    });

    it("age > 70 (string)", function(){
        expect(Users.Any("x => x.Age > 70")).toBe(true);
    });

    it("age > 90", function(){
        expect(Users.Any(x => x.Age > 90)).toBe(false);
    });

    it("age > 90 (string)", function(){
        expect(Users.Any("x => x.Age > 90")).toBe(false);
    });

    it("age < 18", function(){
        expect(Users.Any(x => x.Age < 18)).toBe(false);
    });

    it("age < 18 (string)", function(){
        expect(Users.Any("x => x.Age < 18")).toBe(false);
    });
});