let Users: User[] = [];
let Fruits: string[] = [];
let Numbers: number[] = [];
let Booleans: boolean[] = [];

beforeEach(function(){
    Users = [
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

    Fruits = [
        "Banana",
        "Apple",
        "Pineapple",
        "Coconut",
        "Strawberry",
        "Melon",
        "Apricot",
        "Peach",
        "Nectarine",
        "Pear",
        "Quince",
        "Lemon",
        "Orange",
        "Mandarin",
        "Cherry"
    ];

    Numbers = [
        76, 122, 63, 782, 85, 87, 55, 63, 35, 1, -10, 63.2, 627, 1000
    ];

    Booleans = [
        true, false, false, true, false, true, true, false, false, false, true
    ];
});