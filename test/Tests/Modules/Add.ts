describe("Add", function(){
    it("string", function(){
        Fruits.Add("Fruit");
        expect(Fruits.Count()).toBe(16);
    });

    it("number", function(){
        Numbers.Add(12);
        expect(Numbers.Count()).toBe(15);
    });

    it("user", function(){
        Users.Add(new User(5, "Walter", "Pankey", 61));
        expect(Users.Count()).toBe(17);
    });

    it("null", function(){
        Users.Add(null);
        expect(Users.Count()).toBe(16);
    });

    it("auto generate", function(){
        let newUser = new User(5, "Walter", "Pankey", 61);
        Users.Add(newUser, true);
        expect(Users.Count()).toBe(17);
        expect(((newUser as any) as Linq4JS.GeneratedEntity)._GeneratedId_).toBe(1);

        let newUser2 = new User(5, "Walter", "Pankey", 61);
        Users.Add(newUser2, true);
        expect(Users.Count()).toBe(18);
        expect(((newUser2 as any) as Linq4JS.GeneratedEntity)._GeneratedId_).toBe(2);
    });
});