describe("OrderBy", function(){
    it("users", function(){
        expect(Users.OrderBy(u => u.Age).Last()).toEqual(Users[9]);
    });
});
