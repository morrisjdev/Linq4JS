describe("SequenceEqual", function(){
    it("name", function(){
        expect(Users.SequenceEqual(Users)).toBeTruthy();
        expect(Users.SequenceEqual(Users.Skip(1))).toBeFalsy();
        expect(Users.SequenceEqual(<any>Fruits)).toBeFalsy();
    });

    it("numbers", function() {
        var source1 = [1, 2, 3];
        var source2 = [1, 2, 4];
        expect(source1.SequenceEqual(source2)).toBeFalsy();
    });
});
