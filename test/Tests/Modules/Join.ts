describe("Join", function(){
    it("users", function(){
        expect(Users.Join("t"))
            .toEqual("[object Object]t[object Object]t[object Object]t[object Object]t[object Object]t[object Object]" +
                "t[object Object]t[object Object]t[object Object]t[object Object]t[object Object]t[object Object]" +
                "t[object Object]t[object Object]t[object Object]t[object Object]");
    });
});
