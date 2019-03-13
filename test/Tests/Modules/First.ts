describe("First", function(){
    it("users", function(){
        expect(Users.First()).toEqual(Users[0]);
        expect(Users.First(u => u.Id === 3)).toEqual(Users[2]);
        expect(() => {
            Users.First(u => u.Id === 0);
        }).toThrow();
    });
});
