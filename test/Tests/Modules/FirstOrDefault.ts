describe("FirstOrDefault", function(){
    it("users", function(){
        expect(Users.FirstOrDefault()).toEqual(Users[0]);
        expect(Users.FirstOrDefault(u => u.Id === 3)).toEqual(Users[2]);
        expect(Users.FirstOrDefault(u => u.Id === 0)).toBe(null);
    });
});
