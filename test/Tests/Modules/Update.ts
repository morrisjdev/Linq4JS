describe("Update", function(){
    it("users", function(){
        expect(Users[0].Age).toEqual(49);

        let user = Users.FirstOrDefault();
        user.Age = 12;

        Users.Update(user, x => x.Id);

        expect(Users[0].Age).toEqual(12);
    });
});
