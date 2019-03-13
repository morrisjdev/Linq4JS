describe("Insert", function(){
    it("users", function(){
        Users.Insert(<any>"Test", 3);
        expect(<any>Users[3]).toEqual("Test");
    });
});
