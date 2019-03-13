describe("Single", function(){
    it("user", function(){
        expect(() => {
            Users.Single();
        }).toThrow();

        expect(() => {
            [].Single();
        }).toThrow();

        expect(Users.Skip(15).Single()).toEqual(Users[15]);
    });
});
