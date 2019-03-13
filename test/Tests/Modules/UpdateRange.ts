describe("UpdateRange", function(){
    it("users", function(){
        expect(Users[0].Age).toEqual(49);
        expect(Users[1].Age).toEqual(62);

        let user = Users.FirstOrDefault();
        user.Age = 12;

        let user2 = Users.Skip(1).FirstOrDefault();
        user2.Age = 13;

        Users.UpdateRange([user, user2], x => x.Id);

        expect(Users[0].Age).toEqual(12);
        expect(Users[1].Age).toEqual(13);
    });
});
