describe("ForEach", function(){
    it("users", function(){
        let result = 0;
        Users.ForEach((u) => {
            result += u.Id;
        });
        expect(result).toEqual(136);
    });
});
