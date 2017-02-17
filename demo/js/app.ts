class User {
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

class displayClass {
    TestProp: string;

    constructor(_in: User) {
        this.TestProp = `${_in.FirstName} ${_in.Name}`;
    }
}

class Helper {
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
};

let test: Array<User> = [new User(1, "Max", "Mustermann", 18), new User(2, "John", "Doe", 89), new User(2, "John", "Doe", 18)];
console.log(test.Where(x => x.Age > 10));

let result = test.Aggregate((x, y) => {
    return x += y.Age;
});

console.log(result);


let array = ["item1", "item2", "item3", "item2", "item4"];

let res2 = array.TakeWhile('(x, s) => x != "item2" || s.c < 1', 's => s.c = 0', '(x, s) => x == "item2" && s.c++');

console.log(res2);

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