describe("ToDictionary", function(){
    it("name", function(){
        let dictionary = Users.ToDictionary(x => x.Name, x => x.Id);
        expect(Object.keys(dictionary).length).toBe(15);
        expect(dictionary.Thompson).toBe(1);
    });
});
