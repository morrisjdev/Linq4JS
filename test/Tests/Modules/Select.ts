describe("Select", function(){
    it("name", function(){
        let selection = Users.Select(u => u.FirstName);
        expect(selection.Count()).toBe(16);
        expect(typeof selection[0]).toBe("string");
    });
});
