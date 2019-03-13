describe("Reverse", function(){
    it("users", function(){
        let arrayReversed = Users.Reverse();
        expect(arrayReversed.length).toBe(Users.length);
        expect(arrayReversed[arrayReversed.length - 1]).toEqual(Users[0]);
        expect(arrayReversed[0]).toEqual(Users[Users.length - 1]);
    });
});
