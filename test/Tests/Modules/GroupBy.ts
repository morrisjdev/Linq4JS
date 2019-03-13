describe("GroupBy", function(){
    it("users age", function(){
        let grouped = Users.GroupBy(g => g.Age);

        expect(grouped.Count()).toEqual(16);
        expect(grouped.All(g => g.All(v => v.Age === g._linq4js_.GroupValue))).toBe(true);
    });

    it("users name", function () {
        let grouped = Users.GroupBy(g => g.Name);
        expect(grouped.Count()).toEqual(15);
        expect(grouped.All(g => g.All(v => v.Name === g._linq4js_.GroupValue))).toBe(true);
    });
});
