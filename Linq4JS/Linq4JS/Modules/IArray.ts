interface Array<T> {
    Order: Array<Linq4JS.OrderEntry>;

    Clone<T>(): Array<T>;
    FindIndex<T>(filter: any): number;
    Get<T>(index: number): T;
    ForEach<T>(action: any): Array<T>;
    Update<T>(object: T, primaryKeySelector?: any): Array<T>;
    UpdateRange<T>(objects: Array<T>, primaryKeySelector?: any): Array<T>;
    Remove<T>(object: T, primaryKeySelector?: any): Array<T>;
    RemoveRange<T>(objects: Array<T>, primaryKeySelector?: any): Array<T>;
    Add<T>(object: T): Array<T>;
    AddRange<T>(objects: Array<T>): Array<T>;
    Insert<T>(object: T, index: number): Array<T>;
    Where<T>(filter: any): Array<T>;
    Range<T>(start: number, length: number): Array<T>;
    Count<T>(filter?: any): number;
    Any<T>(filter?: any): boolean;
    First<T>(filter?: any): T;
    FirstOrDefault<T>(filter?: any): T;
    Last<T>(filter?: any): T;
    LastOrDefault<T>(filter?: any): T;
    Select<T>(selector: any): Array<T>;
    Take<T>(count: number): Array<T>;
    Skip<T>(count: number): Array<T>;
    OrderBy<T>(valueSelector: any): Array<T>;
    ThenBy<T>(valueSelector: any): Array<T>;
    OrderByDescending<T>(valueSelector: any): Array<T>;
    ThenByDescending<T>(valueSelector: any): Array<T>;
    Move<T>(oldIndex: number, newIndex: number): Array<T>;
    Distinct<T>(valueSelector: any, takelast?: boolean): Array<T>;
}