describe("Get", function(){
    it("users", function(){
        expect(Users.Get(3)).toEqual(Users[3]);
    });
});
