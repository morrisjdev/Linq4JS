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

        Helper.users.Select<displayClass>("u => new displayClass(u)").ForEach<displayClass>(function (u: displayClass) {
            innerContent += `User: ${u.TestProp} <br>`;
        });

        let contentObj = document.getElementById("content");

        contentObj.innerHTML = innerContent;
    }
}

window.onload = function () {
    Helper.users = new Array<User>();

    Helper.users.Add(new User(1, "Morris", "Janatzek", 18));
    Helper.users.Add(new User(2, "Elke", "Janatzek", 54));
    Helper.users.Add(new User(3, "Noel", "Janatzek", 16));
    Helper.users.Add(new User(4, "Thomas", "Janatzek", 58));
    Helper.users.Add(new User(5, "Paul", "Mizel", 40));

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