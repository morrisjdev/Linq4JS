describe("ThenBy", function(){
    it("users", function(){
        expect(() => {
            Users.ThenByDescending(x => x.Age);
        }).toThrow();

        let sorted = Users.OrderBy(u => u.Name).ThenByDescending(u => u.Age);

        expect(sorted[6].Id).toBe(16);
        expect(sorted[5].Id).toBe(2);
    });
});
