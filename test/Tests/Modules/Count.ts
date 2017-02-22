describe("Count", function(){
    it("all", function(){
        expect(Users.Count()).toBe(16);
    });

    it("age > 80", function(){
        expect(Users.Count(x => x.Age > 80)).toBe(2);
    });

    it("age > 80 (string)", function(){
        expect(Users.Count("x => x.Age > 80")).toBe(2);
    });

    it("age < 18", function(){
        expect(Users.Count(x => x.Age < 18)).toBe(0);
    });

    it("age < 18 (string)", function(){
        expect(Users.Count("x => x.Age < 18")).toBe(0);
    });
});