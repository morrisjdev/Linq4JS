describe("Move", function(){
    it("users", function(){
        let newUsers = Users.Clone().Move(0, 4);
        expect(newUsers[4]).toEqual(Users[0]);
    });
});
