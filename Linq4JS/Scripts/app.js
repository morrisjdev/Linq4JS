var User = (function () {
    function User(_id, _firstName, _name, _age) {
        this.Id = _id;
        this.FirstName = _firstName;
        this.Name = _name;
        this.Age = _age;
    }
    return User;
}());
var displayClass = (function () {
    function displayClass(_in) {
        this.TestProp = _in.FirstName + " " + _in.Name;
    }
    return displayClass;
}());
var Helper = (function () {
    function Helper() {
    }
    Helper.draw = function () {
        var innerContent = "";
        Helper.users.Select("u => new displayClass(u)").ForEach(function (u) {
            innerContent += "User: " + u.TestProp + " <br>";
        });
        var contentObj = document.getElementById("content");
        contentObj.innerHTML = innerContent;
    };
    return Helper;
}());
window.onload = function () {
    Helper.users = new Array();
    Helper.draw();
};
//let test: Array<Linq4JS.Entity> = [new testClass("test", 5, 1), new testClass("test5", 3, 2)];
//console.log(test);
//console.log("Foreach");
//test.ForEach(x => console.log(x.Name));
//console.log("Foreach End");
//console.log(test.Take(1));
//console.log(test.Skip(1));
//test.Update(new testClass("test1235234234234", 3, 1), "x => x.OtherId");
//console.log(test);
//console.log(test.Where(x => x.Id == 3));
//console.log(test.Any(x => x.Id == 78));
//console.log(test.First(x => x.Id == 3));
//console.log(test.FirstOrDefault());
//console.log(test.Last(x => x.Id == 3));
//console.log(test.LastOrDefault(x => x.Id == 44));
//console.log(test.Select(x => new displayClass(x)));
//test.Remove(new testClass("test55", 3, 1), x => x.OtherId);
//console.log(test);
//console.log(test.Count(x => x.Id > 3)); 
//# sourceMappingURL=app.js.map