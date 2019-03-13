describe("Skip", function(){
    it("user", function(){
        let result = Users.Skip(5);
        expect(result.length).toBe(11);
        expect(result[0]).toEqual(Users[5]);
    });
});
