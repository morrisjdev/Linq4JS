describe("SequenceEqual", function(){
    it("name", function(){
        expect(Users.SequenceEqual(Users)).toBeTruthy();
        expect(Users.SequenceEqual(Users.Skip(1))).toBeFalsy();
        expect(Users.SequenceEqual(<any>Fruits)).toBeFalsy();
    });

    it("numbers", function() {
        var source1 = [1, 2, 3];
        var source2 = [1, 2, 4];
        expect(source1.SequenceEqual(source2)).toBeFalsy();
    });

    it("arrays", function() {
        var source1 = [
            [1, 2, 3],
            [2, 3, 4]
        ];
        var source2 = [
            [1, 2, 3],
            [2, 3, 4]
        ];
        var source3 = [
            { },
            [2, 4, 4]
        ];

        expect(source1.SequenceEqual(source2)).toBeTruthy();
        expect(source1.SequenceEqual(source3)).toBeFalsy();
    });

    it("objects", function() {
       var source1 = [
           { k1: 1, k2: 'test2', k3: false },
           { k1: 2, k2: 'test5', k3: true },
           { k1: 5, k2: 'test1', k3: false }
       ];
        var source2 = [
            { k1: 1, k2: 'test2', k3: false },
            { k1: 2, k2: 'test5', k3: true },
            { k1: 5, k2: 'test1', k3: false }
        ];
        var source3 = [
            { k1: 1, k2: 'test1', k3: false },
            { k1: 6, k2: 'test5', k3: true },
            { k1: 5, k2: 'test1', k3: false }
        ];

        expect(source1.SequenceEqual(source2)).toBeTruthy();
        expect(source1.SequenceEqual(source3)).toBeFalsy();
    });
});
