describe("SelectMany", function(){
    it("name", function(){
        let selection = [Users, Users].SelectMany(u => u);
        expect(selection.Count()).toBe(32);
        expect(typeof selection[0]).toBe("object");
    });
});
