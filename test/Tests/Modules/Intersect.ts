describe("Intersect", function(){
    it("users", function(){
        expect(Users.Intersect(Users.Skip(5).Take(10))).toEqual(Users.Skip(5).Take(10));
    });
});
