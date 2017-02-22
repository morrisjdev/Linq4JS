describe("Where", function(){
    it("age > 70", function(){
        expect(Users.Where(x => x.Age > 70).Count()).toEqual(3);
    });

    it("age > 70 (string)", function(){
        expect(Users.Where("x => x.Age > 70").Count()).toEqual(3);
    });

    it("age > 70 && id > 10", function(){
        expect(Users.Where(x => x.Age > 70 && x.Id > 10).Count()).toEqual(2);
    });

    it("age > 70 && id > 10 (string)", function(){
        expect(Users.Where("x => x.Age > 70 && x.Id > 10").Count()).toEqual(2);
    });

    it("age > 70 && firstname.length > 6", function(){
        expect(Users.Where(x => x.Age > 70 && x.FirstName.length > 6).Count()).toEqual(1);
    });

    it("age > 70 && firstname.length > 6 (string)", function(){
        expect(Users.Where("x => x.Age > 70 && x.FirstName.length > 6").Count()).toEqual(1);
    });

    it("name contains 'in'", function(){
        expect(Users.Where(x => x.FirstName.match(/in/) != null).Count()).toEqual(4);
    });

    it("name contains 'in' (string)", function(){
        expect(Users.Where("x => x.FirstName.match(/in/) != null").Count()).toEqual(4);
    });
});