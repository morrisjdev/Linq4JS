describe("Function Converter", function(){
    it("correct string", function(){
        expect(function(){
            Linq4JS.Helper.ConvertFunction("x => x");
        }).not.toThrow();
    });

    it("empty string", function(){
        expect(function(){
            Linq4JS.Helper.ConvertFunction("");
        }).toThrow();
    });

    it("number", function(){
        expect(function(){
            Linq4JS.Helper.ConvertFunction(12);
        }).toThrow();
    });

    it("false string", function(){
        expect(function(){
            Linq4JS.Helper.ConvertFunction("x = x.age");
        }).toThrow();
    });
});