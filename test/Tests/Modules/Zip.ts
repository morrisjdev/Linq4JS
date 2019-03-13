describe("Zip", function(){
    it("name", function(){
        let selection = Users.Take(10).Zip(Fruits.Take(10), (x: User, y) => x.Name + y);
        expect(selection[0]).toBe("ThompsonBanana");
    });
});
