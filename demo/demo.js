"use strict";
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
    return Helper;
}());
Helper.draw = function () {
    var innerContent = "";
    Helper.users.Select("u => new displayClass(u)").ForEach(function (u) {
        innerContent += "User: " + u.TestProp + " <br>";
    });
    var contentObj = document.getElementById("content");
    contentObj.innerHTML = innerContent;
};
window.onload = function () {
    Helper.users = new Array();
    Helper.users = Helper.users.Clone();
    Helper.draw();
};
var test = [new User(1, "Max", "Mustermann", 18), new User(2, "John", "Doe", 89), new User(2, "John", "Doe", 18)];
console.log(test.Where(function (x) { return x.Age > 10; }));
test.Add(new User(5, "User", "Test", 12), true);
var result = test.Aggregate(function (x, y) {
    return x += y.Age;
});
console.log(result);
var array = ["item1", "item2", "item3", "item2", "item4"];
var res2 = array.TakeWhile('(x, s) => x != "item2" || s.c < 1', 's => s.c = 0', '(x, s) => x == "item2" && s.c++');
console.log(res2);
