describe("SequenceEqual", function(){
    it("name", function(){
        expect(Users.SequenceEqual(Users)).toBeTruthy();
        expect(Users.SequenceEqual(Users.Skip(1))).toBeFalsy();
        expect(Users.SequenceEqual(<any>Fruits)).toBeFalsy();
    });
});
