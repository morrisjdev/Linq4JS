describe("Repeat", function(){
    it("users", function(){
        let array = [].Repeat(5, 10);
        expect(array.length).toBe(10);
        expect(array.All(v => v === 5)).toBe(true);
    });
});
