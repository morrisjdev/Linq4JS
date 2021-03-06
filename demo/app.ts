﻿class User {
    Id: number;
    FirstName: string;
    Name: string;
    Age: number;

    constructor(_id: number, _firstName: string, _name: string, _age: number) {
        this.Id = _id;
        this.FirstName = _firstName;
        this.Name = _name;
        this.Age = _age;
    }
}

/*class displayClass {
    TestProp: string;

    constructor(_in: User) {
        this.TestProp = `${_in.FirstName} ${_in.Name}`;
    }
}*/

/*class Helper {
    static users: Array<User>;

    static draw = function () {

        let innerContent: string = "";

        Helper.users.Select("u => new displayClass(u)").ForEach(function (u: displayClass) {
            innerContent += `User: ${u.TestProp} <br>`;
        });

        let contentObj = document.getElementById("content");

        contentObj.innerHTML = innerContent;
    }
}

window.onload = function () {
    Helper.users = new Array<User>();

    Helper.users = Helper.users.Clone();

    Helper.draw();
};*/

/*let test: Array<User> = [new User(1, "Max", "Mustermann", 18), new User(2, "John", "Doe", 89), new User(2, "John", "Doe", 18)];
console.log(test.Where(x => x.Age > 10));

test.Add(new User(5, "User", "Test", 12), true);

let result = test.Aggregate((x, y) => {
    return x += y.Age;
});

console.log(result);

let array = ["item1", "item2", "item3", "item2", "item4"];
let res2 = array.TakeWhile('(x, s) => x != "item2" || s.c < 1', 's => s.c = 0', '(x, s) => x == "item2" && s.c++');

console.log(res2);

console.log(array.FindLastIndex(x => x == "item2"));
*/

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

let userArray: User[] = [
    new User(1, "Brenda", "Thompson", 49),
    new User(2, "Kelly", "Grady", 62),
    new User(3, "Lavina", "Baskin", 34),
    new User(4, "Corey", "Medina", 53),
    new User(5, "Walter", "Pankey", 61),
    new User(6, "Virginia", "Ayala", 54),
    new User(7, "Allison", "Israel", 38),
    new User(8, "Christine", "Starkey", 19),
    new User(9, "Robert", "Humphreys", 22),
    new User(10, "Daniel", "Stanley", 85),
    new User(11, "Frank", "Brown", 73),
    new User(12, "Juan", "Barnhart", 56),
    new User(13, "Timothy", "Olson", 29),
    new User(14, "Christina", "Holland", 81),
    new User(15, "Albert", "Dunn", 58),
    new User(16, "Kelly", "Grady", 48)
];

window.onload = function(){
    arrayPreview.innerHTML = JSON.stringify(userArray);
    resultdisplay.innerHTML = JSON.stringify(userArray);
};

let updateFunction = function() {
    try {
        let newArray = userArray.Clone();

        resultdisplay.innerHTML = JSON.stringify(newArray.Evaluate(sqltext.value));
        error.innerHTML = "";
    } catch (ex) {
        error.innerHTML = ex;
    }
};

let obj = "test";