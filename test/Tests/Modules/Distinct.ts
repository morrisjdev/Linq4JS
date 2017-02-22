describe("Distinct", function(){
    it("numbers", function(){
        expect(Numbers.Distinct().Count()).toBe(13);
    });

    it("booleans", function(){
        expect(Booleans.Distinct().Count()).toBe(2);
    });
});