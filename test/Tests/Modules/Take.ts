describe("Take", function(){
    it("user", function(){
        let result = Users.Take(5);
        expect(result.length).toBe(5);
        expect(result[0]).toEqual(Users[0]);
    });
});
