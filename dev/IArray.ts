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
    All(filter: any): boolean;
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
    Contains(object: T): boolean;
    Concat(array: Array<T>): Array<T>;
    Join(character: string, selector?: any): string;
    Aggregate(method: any): string;
    Reverse(): Array<T>;
    Average(selector?: any, filter?: any): number;
}