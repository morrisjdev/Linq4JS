declare namespace Linq4JS {
    class Entity implements Entity {
        constructor(_id: number);
        Id: number;
    }
}
declare namespace Linq4JS {
    class Helper {
        static ConvertStringFunction: Function;
        static ConvertFunction: Function;
        static OrderCompareFunction: Function;
    }
}
interface Array<T> {
    Order: Array<Linq4JS.OrderEntry>;
    Clone(): Array<T>;
    FindIndex(filter: any): number;
    Get(index: number): T;
    ForEach(action: any): Array<T>;
    Update(object: T, primaryKeySelector?: any): Array<T>;
    UpdateRange(objects: Array<T>, primaryKeySelector?: any): Array<T>;
    Remove(object: T, primaryKeySelector?: any): Array<T>;
    RemoveRange(objects: Array<T>, primaryKeySelector?: any): Array<T>;
    Add(object: T, generateId?: boolean): Array<T>;
    AddRange(objects: Array<T>): Array<T>;
    Insert(object: T, index: number): Array<T>;
    Where(filter: any): Array<T>;
    Range(start: number, length: number): Array<T>;
    Count(filter?: any): number;
    Any(filter?: any): boolean;
    First(filter?: any): T;
    FirstOrDefault(filter?: any): T;
    Last(filter?: any): T;
    LastOrDefault(filter?: any): T;
    Select(selector: any): any[];
    Take(count: number): Array<T>;
    Skip(count: number): Array<T>;
    OrderBy(valueSelector: any): Array<T>;
    ThenBy(valueSelector: any): Array<T>;
    OrderByDescending(valueSelector: any): Array<T>;
    ThenByDescending(valueSelector: any): Array<T>;
    Move(oldIndex: number, newIndex: number): Array<T>;
    Distinct(valueSelector: any, takelast?: boolean): Array<T>;
}
declare namespace Linq4JS {
    class OrderEntry {
        test: string;
        Direction: OrderDirection;
        ValueSelector: Function;
        constructor(_direction: OrderDirection, _valueSelector: Function);
    }
    enum OrderDirection {
        Ascending = 0,
        Descending = 1,
    }
}
