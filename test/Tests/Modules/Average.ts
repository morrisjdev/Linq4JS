describe("Average", function(){
    it("numbers", function(){
        let result = Users.Average(x => x.Age);
        expect(result).toBe(51.375);
    });
});
