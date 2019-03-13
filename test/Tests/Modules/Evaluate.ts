describe("Evaluate", function(){
    it("users", function(){
        let result = Users.Evaluate("select x => x.Id");
        expect(result).toEqual(Users.Select(x => x.Id));
    });
});
