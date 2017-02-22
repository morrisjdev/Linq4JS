class User {
    public Id: number;
    public FirstName: string;
    public Name: string;
    public Age: number;

    constructor(_id: number, _firstName: string, _name: string, _age: number) {
        this.Id = _id;
        this.FirstName = _firstName;
        this.Name = _name;
        this.Age = _age;
    }
}