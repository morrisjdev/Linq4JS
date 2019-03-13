describe("Concat", function(){
    it("users", function(){
        let result = Users.Concat([new User(1, "test", "test", 12)]);
        expect(result.Count()).toEqual(Users.Count() + 1);
    });
});
