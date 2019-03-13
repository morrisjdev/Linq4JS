describe("FindLastIndex", function(){
    it("users", function(){
        let result = Users.Add(Users[2]).FindLastIndex(u => u.Id === 3);
        expect(result).toBe(16);
    });
});
