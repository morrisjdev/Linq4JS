describe("Sum", function(){
    it("user", function(){
        let result = Users.Sum(x => x.Age);
        expect(result).toBe(822);
    });
});
