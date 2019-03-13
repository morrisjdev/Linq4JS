describe("Last", function(){
    it("users", function(){
        expect(Users.Last()).toEqual(Users[Users.length - 1]);
        expect(Users.Last(u => u.Id === 3)).toEqual(Users[2]);
        expect(() => {
            Users.Last(u => u.Id === 0);
        }).toThrow();
    });
});
