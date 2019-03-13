describe("All", function(){
    it("not null", function(){
        expect(Users.All(x => x != null)).toBe(true);
    });
});
