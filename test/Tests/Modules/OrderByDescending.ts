describe("OrderByDescending", function(){
    it("users", function(){
        expect(Users.OrderByDescending(u => u.Age).Last()).toEqual(Users[7]);
    });
});
