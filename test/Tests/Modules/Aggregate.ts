describe("Aggregate", function(){
    it("numbers", function(){
        let result: number = <any>Users.Aggregate((x, y) => x + y.Age, 0);
        expect(result).toBe(822);
    });
});
