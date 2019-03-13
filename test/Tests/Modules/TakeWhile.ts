describe("TakeWhile", function(){
    it("user", function(){
        let result = Users.TakeWhile(x => x.Id < 10);
        expect(result.length).toBe(9);
        expect(result[8].Id).toBe(9);
    });
});
