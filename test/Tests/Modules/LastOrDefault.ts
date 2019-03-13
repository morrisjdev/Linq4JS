describe("LastOrDefault", function(){
    it("users", function(){
        expect(Users.LastOrDefault()).toEqual(Users[Users.length - 1]);
        expect(Users.LastOrDefault(u => u.Id === 3)).toEqual(Users[2]);
        expect(Users.FirstOrDefault(u => u.Id === 0)).toBe(null);
    });
});
