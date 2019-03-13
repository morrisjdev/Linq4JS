describe("Range", function(){
    it("users", function(){
        let range = Users.Range(5, 4);
        expect(range.length).toBe(4);
        expect(range[0]).toEqual(Users[5]);
        expect(range[1]).toEqual(Users[6]);
        expect(range[2]).toEqual(Users[7]);
        expect(range[3]).toEqual(Users[8]);
    });
});
