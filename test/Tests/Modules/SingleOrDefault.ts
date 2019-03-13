describe("SingleOrDefault", function(){
    it("user", function(){
        expect(() => {
            Users.SingleOrDefault();
        }).toThrow();

        expect([].SingleOrDefault()).toBe(null);
        expect(Users.Skip(15).SingleOrDefault()).toEqual(Users[15]);
    });
});
