declare namespace Linq4JS {
    class GeneratedEntity {
        _GeneratedId_: number;
        Id: number;
    }
}
declare namespace Linq4JS {
    class Helper {
        static ConvertStringFunction: (functionString: string) => any;
        static ConvertFunction: <T>(testFunction: any) => T;
        static OrderCompareFunction: <T>(valueSelector: (item: T) => any, a: T, b: T, invert: boolean) => number;
    }
}
interface Array<T> {
    Order: Array<Linq4JS.OrderEntry>;
    GroupValue: any;
    /**
     * Creates a copy of the array
     */
    Clone(): Array<T>;
    /**
     * Gets the index of the first item found by a filter
     * @param filter A function (or function-string) that returns a boolean when matching element was found
     */
    FindIndex(filter: ((item: T) => boolean) | string): number;
    /**
     * Gets the index of the last item found by a filter
     * @param filter A function (or function-string) that returns a boolean when matching element was found
     */
    FindLastIndex(filter: ((item: T) => boolean) | string): number;
    /**
     * Gets the item with the index
     * @param index Item index
     */
    Get(index: number): T;
    /**
     * Executes a method for each item in the array
     * @param action A function (or function-string) that gets executed for each element. If it returns false the loop stops.
     */
    ForEach(action: ((item: T, index?: number) => boolean | any) | string): Array<T>;
    /**
     * Updates an object in the array
     * @param object The object to update
     * @param primaryKeySelector A selector-function (or function-string) to define a property to indentify object in array
     */
    Update(object: T, primaryKeySelector?: ((item: T) => any) | string): Array<T>;
    /**
     * Updates objects in the array
     * @param objects The array of objects to update
     * @param primaryKeySelector A selector-function (or function-string) to define a property to indentify object in array
     */
    UpdateRange(objects: Array<T>, primaryKeySelector?: ((item: T) => any) | string): Array<T>;
    /**
     * Removes an object from the array
     * @param object The object to remove
     * @param primaryKeySelector A selector-function (or function-string) to define a property to indentify object in array
     */
    Remove(object: T, primaryKeySelector?: ((item: T) => any) | string): Array<T>;
    /**
     * Removes objects from the array
     * @param objects The array of objects to remove
     * @param primaryKeySelector A selector-function (or function-string) to define a property to indentify object in array
     */
    RemoveRange(objects: Array<T>, primaryKeySelector?: ((item: T) => any) | string): Array<T>;
    /**
     * Adds an object to the array
     * @param object The object to add
     * @param generateId Auto-generate a property to identify object in later processes
     */
    Add(object: T, generateId?: boolean): Array<T>;
    /**
     * Adds objects to the array
     * @param objects The array of objects to add
     * @param generateId Auto-generate a property to identify objects in later processes
     */
    AddRange(objects: Array<T>): Array<T>;
    /**
     * Inserts an entry at a specific position
     * @param object The object to insert
     * @param index The position to insert
     */
    Insert(object: T, index: number): Array<T>;
    /**
     * Searches for all items in array that match the given filter
     * @param filter A function (or function-string) that returns a boolean when matching element was found
     */
    Where(filter: ((item: T, index?: number) => boolean) | string): Array<T>;
    /**
     * Takes items in a specific range
     * @param start The start position
     * @param length The number of elements to take
     */
    Range(start: number, length: number): Array<T>;
    /**
     * Repeats an object in the array
     * @param object The object to repeat
     * @param count The count of repeats
     */
    Repeat(object: T, count: number): Array<T>;
    /**
     * Returns the length of the array
     * @param filter If set the function returns count of elements matched by the condition
     */
    Count(filter?: ((item: T) => boolean) | string): number;
    /**
     * Tests if all items in the array match the condition
     * @param filter A function (or function-string) that returns a boolean when matching element was found
     */
    All(filter: ((item: T) => boolean) | string): boolean;
    /**
     * Tests if any item is in the array
     * @param filter If set the function tests if any item in the array matches the condition
     */
    Any(filter?: ((item: T) => boolean) | string): boolean;
    /**
     * Returns the first item of the array - Throws an exception if no item was found
     * @param filter If set the function returns the first item that matches the filter
     */
    First(filter?: ((item: T) => boolean) | string): T;
    /**
     * Returns the first item of the array - returns `null` if no suitable item was found
     * @param filter If set the function returns the first item that matches the filter
     */
    FirstOrDefault(filter?: ((item: T) => boolean) | string): T;
    /**
     * Returns the last item of the array - Throws an exception if no item was found
     * @param filter If set the function returns the last item that matches the filter
     */
    Last(filter?: ((item: T) => boolean) | string): T;
    /**
     * Returns the last item of the array - returns `null` if no suitable item was found
     * @param filter If set the function returns the last item that matches the filter
     */
    LastOrDefault(filter?: ((item: T) => boolean) | string): T;
    /**
     * Select the properties for a new array
     * @param selector A function (or a function-string) that returns a new object
     */
    Select(selector: ((item: T) => any) | string): any[];
    /**
     * Limits the number of entries taken
     * @param count The count of elements taken
     */
    Take(count: number): Array<T>;
    /**
     * Takes entries as long as a condition is true
     * @param condition The condition-function (or function-string) that returns a boolean. All elements until a false gets created are taken
     * @param initial A initial-function (or function-string) that gets executed once at the start of the loop
     * @param after A function that gets executed after every element-iteration after the condition-function was evaluated
     */
    TakeWhile(condition: ((item: T, storage?: any) => boolean) | string, initial?: ((storage: any) => void) | string, after?: ((item: T, storage: any) => void) | string): Array<T>;
    /**
     * Skips entries
     * @param count The count of elements skipped
     */
    Skip(count: number): Array<T>;
    /**
     * Orders array by property or value in ascending direction
     * @param valueSelector The selector-function (or function-string) that selects the property for sorting
     */
    OrderBy(valueSelector: ((item: T) => any) | string): Array<T>;
    /**
     * Orders array by additional properties in ascending direction in combination with OrderBy/OrderByDescending
     * @param valueSelector The selector-function (or function-string) that selects the property for sorting
     */
    ThenBy(valueSelector: ((item: T) => any) | string): Array<T>;
    /**
     * Orders array by property or value in descending direction
     * @param valueSelector The selector-function (or function-string) that selects the property for sorting
     */
    OrderByDescending(valueSelector: ((item: T) => any) | string): Array<T>;
    /**
     * Orders array by additional properties in descending direction in combination with OrderBy/OrderByDescending
     * @param valueSelector The selector-function (or function-string) that selects the property for sorting
     */
    ThenByDescending(valueSelector: ((item: T) => any) | string): Array<T>;
    /**
     * Returns the smallest element in array
     * @param valueSelector The selector-function (or function-string) that selects the property for comparison
     */
    Min(valueSelector?: ((item: T) => any) | string): T;
    /**
     * Returns the greates element in array
     * @param valueSelector The selector-function (or function-string) that selects the property for comparison
     */
    Max(valueSelector?: ((item: T) => any) | string): T;
    /**
     * Groups array by property
     * @param selector The selector-function (or function-string) that selects the property for grouping
     */
    GroupBy(selector: ((item: T) => any) | string): Array<Array<T>>;
    /**
     * Moves an item from one index to another
     * @param oldIndex The current position of the item
     * @param newIndex The new position of the item
     */
    Move(oldIndex: number, newIndex: number): Array<T>;
    /**
     * Makes all values unique
     * @param valueSelector A selector-function (or function-string) to select property for comparison and distinction
     */
    Distinct(valueSelector?: ((item: T) => any) | string): Array<T>;
    /**
     * Tests if array contains specific object
     * @param object The object to test for
     */
    Contains(object: T): boolean;
    /**
     * Combines two arrays
     * @param array The array to combine
     */
    Concat(array: Array<T>): Array<T>;
    /**
     * Combines two arrays but only applies values that are in both arrays
     * @param array The array to combine
     */
    Intersect(array: Array<T>): Array<T>;
    /**
     * Joins the entries by a given char
     * @param character The character for joining
     * @param selector A selector-function (or function-string) to select property for joining
     */
    Join(character: string, selector?: ((item: T) => any) | string): string;
    /**
     * Combines the entries using a custom function
     * @param method A function (or function-string) for aggregation
     * @param startVal The value to start aggregation
     */
    Aggregate(method: ((result: any, item: T) => any) | string, startVal?: any): string;
    /**
     * Reverses the array
     */
    Reverse(): Array<T>;
    /**
     * Computes the average of the elements
     * @param selector A selector-function (or function-string) to select property for average computing
     * @param filter If set the function computes the average of elements that match the filter
     */
    Average(selector?: ((item: T) => any) | string, filter?: ((item: T) => boolean) | string): number;
    /**
     * Computes the sum of the elements
     * @param selector A selector-function (or function-string) to select property for adding
     * @param filter If set the function computes the sum of elements that match the filter
     */
    Sum(selector?: ((item: T) => any) | string, filter?: ((item: T) => boolean) | string): number;
    /**
     * Compares to sequences of objects
     * @param array The array to compare
     */
    SequenceEqual(array: Array<T>): boolean;
    /**
     * Combines the entries of two arrays using a custom function
     * @param array The array to combine
     * @param result The function (or function-string) to combine elements
     */
    Zip<T, X>(array: Array<X>, result: ((first: T, second: X) => any) | string): Array<any>;
    /**
     * Combines two arrays without duplicates
     * @param array The array to combine
     */
    Union(array: Array<T>): Array<T>;
    /**
     * Converts the array to a dictionary
     * @param keySelector The selector-function (or function-string) to select property for key
     * @param valueSelector A selector-function (or function-string) to select property for value
     */
    ToDictionary(keySelector: ((item: T) => any) | string, valueSelector?: ((item: T) => any) | string): any;
}
declare module "linq4js" {
    export = Linq4JS;
}
declare namespace Linq4JS {
    class OrderEntry {
        Direction: OrderDirection;
        ValueSelector: (item: any) => any;
        constructor(_direction: OrderDirection, _valueSelector: (item: any) => any);
    }
    enum OrderDirection {
        Ascending = 0,
        Descending = 1,
    }
}
