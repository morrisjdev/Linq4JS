describe("AddRange", function(){
    it("strings", function(){
        Fruits.AddRange(["Fruit", "another Fruit"]);
        expect(Fruits.Count()).toBe(17);
    });

    it("numbers", function(){
        Numbers.AddRange([12, 13]);
        expect(Numbers.Count()).toBe(16);
    });

    it("users", function(){
        Users.AddRange([new User(5, "Walter", "Pankey", 61), new User(6, "Walter", "Pankey", 61)]);
        expect(Users.Count()).toBe(18);
    });

    it("null", function(){
        Users.AddRange([null, null]);
        expect(Users.Count()).toBe(16);
    });

    it("auto generate", function(){
        let newUser = new User(5, "Walter", "Pankey", 61);
        let newUser2 = new User(5, "Walter", "Pankey", 61);
        Users.AddRange([newUser, newUser2], true);
        expect(Users.Count()).toBe(18);
        expect(((newUser as any) as Linq4JS.GeneratedEntity)._GeneratedId_).toBe(1);
        expect(((newUser2 as any) as Linq4JS.GeneratedEntity)._GeneratedId_).toBe(2);
    });
});