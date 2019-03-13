describe("Union", function(){
    it("users", function(){
        expect(Users.Union(Users).Count()).toEqual(16);
    });
});
