describe("FindIndex", function(){
    it("users", function(){
        let result = Users.FindIndex(u => u.Id === 3);
        expect(result).toBe(2);
    });
});
