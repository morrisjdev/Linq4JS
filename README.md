# Linq4JS [![Build Status](https://travis-ci.org/morrisjdev/Linq4JS.svg?branch=master)](https://travis-ci.org/morrisjdev/Linq4JS) [![Known Vulnerabilities](https://snyk.io/test/github/morrisjdev/Linq4JS/badge.svg?targetFile=package.json)](https://snyk.io/test/github/morrisjdev/Linq4JS?targetFile=package.json)

Linq methods for JavaScript/TypeScript for working with arrays

This simple extension works with array of complex objects as well as simple arrays of strings etc. The whole thing is written in TypeScript but also usable in JavaScript

## Advantages

This extension is lightweight and fast and you can use your Lambda-Expression-Syntax to work with arrays. The methods are mostly identically to .NET methods.

As expressions you can use the normal Function-Syntax:

```javascript
array.Where(function(x){
	return x.Name == "Max";
});
```

Lambda-Expressions (IE isn't compatible with this Lambda-Expressions):

```javascript
array.Where(x => x.Name == "Max");
```

or Lambda-Expressions as Strings (this Syntax works in IE):

```javascript
array.Where("x => x.Name == 'Max'");
```

### SQL-Like

Also a complete procedure as an sql-like string is supported

```
array.Evaluate("select x => x.Id sum");
```

```
clone
reverse
where x => x.Age > 70
order by x => x.Name
then by x => x.FirstName descending
for each x => console.log(x)
select x => {x.Name}
```

### Conclusion

* Works with multiple Browsers (even IE)
* Angular Support (event directly in Views if using Strings as Expression-Syntax)
* Lightweight
* Fast
* Syntax from .NET
* Build on top of array-prototype and no changes in code are required for usage
* Integrates seamlessly into the project
* TypeScript definitions

## Getting Started

### Install using NPM

```
npm install linq4js
```

### Install using Bower

```
bower install linq4js
```

### Using JavaScript

Include this line in your project

```html
<script type="text/javascript" src="linq4js.js"></script>
```

### Using TypeScript

Use

```
import "linq4js";
```

or 

```html
<script type="text/javascript" src="linq4js.js"></script>
```

to import the scripts and optionally (if you are not using npm) install `@types/linq4js` to also get tooling support.

## Usage

### Clone

Creates a copy of the array

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//["item1", "item2", "item3", "item4", "no"]
array.Clone();
```

### FindIndex

Gets the index of the first item found by a filter

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//2
array.FindIndex("x => x == 'item3'");
```

### FindLastIndex

Gets the index of the last item found by a filter

```javascript
var array = ["item1", "item2", "item3", "item2", "item4", "no"];

//3
array.FindIndex("x => x == 'item2'");
```

### Get

Gets the item with the index

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//"item3"
array.Get(2);
```

### Repeat

Repeats an object in the array

```javascript
var array = ["item1", "item2", "item3", "item4"];

//["item1", "item2", "item3", "item4", "example", "example", "example"]
array.Repeat("example", 3);
```

### ForEach

Executes a method for each item in the array

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];
array.ForEach("i => console.log(i)");
```

### Update & UpdateRange

Updates object(s) in the array

By default this method uses the property **Id** to identify the objects. If the property is not set this methods tries to compare the objects directly.

```javascript
var array = [{Id: 1, Value: "item1"}, {Id: 2, Value: "item2"}];
	
//[{Id: 1, Value: "item3"}, {Id: 2, Value: "item2"}]
array.Update({Id: 1, Value: "item3"});
```

If you want this method to use other fields for identification define a selector function as second parameter.

```javascript
var array = [{OtherId: 1, Value: "item1"}, {OtherId: 2, Value: "item2"}];
	
//[{Id: 1, Value: "item3"}, {Id: 2, Value: "item2"}]
array.Update({OtherId: 1, Value: "item3"}, "x => x.OtherId");
```

You can upgrade multiple objects simultaneously

```javascript
var array = [{OtherId: 1, Value: "item1"}, {OtherId: 2, Value: "item2"}];
	
//[{Id: 1, Value: "item3"}, {Id: 2, Value: "item4"}]
array.UpdateRange(
	[{OtherId: 1, Value: "item3"}, {OtherId: 2, Value: "item4"}], 
	"x => x.OtherId");
```

### Remove & RemoveRange

Removes item(s) from array

By default this method uses the property **Id** to identify the objects. If the property is not set this methods tries to compare the objects directly.

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//["item1", "item2", "item3", "item4"]
array.Remove("no");
	
//["item1", "item2"]
array.RemoveRange(["item4", "item3"]);
```

If you want this method to use other fields for identification define a selector function as second parameter.

```javascript
var array = [{OtherId: 1, Value: "item1"}, {OtherId: 2, Value: "item2"}];

//[{OtherId: 2, Value: "item2"}]
array.Remove({OtherId: 1}, "x => x.OtherId");
```

### Add & AddRange

Adds the item(s) to the array

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//["item1", "item2", "item3", "item4", "no", "item5"]
array.Add("item5");

//["item1", "item2", "item3", "item4", "no", "item5", "item6", "item7"]
array.AddRange(["item6", "item7"]);
```

### Insert

Inserts an entry at a specific position

```javascript
var array = ["item1", "item2", "item3", "item4"];

//["item1", "item2", "item2.5", "item3", "item4"]
array.Insert("item2.5", 2);
```

### Where

Searches for all items in array that match the given filter

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//["item1", "item2", "item3", "item4"]
array.Where("i => i.match(/item/gi)");
```

### Range

Takes items in a specific range

```javascript
var array = ["item1", "item2", "item3", "item4"];

//["item2", "item3"]
array.Range(1, 2);
```

### Count

Returns the length of the array or if a filter is set the length of the resulting array

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//5
array.Count();

//4
array.Count("i => i.match(/item/gi)");
```

### SequenceEqual

Compares to sequences of objects

```javascript
var array = ["item1", "item2", "item3"];
var array2 = ["item1", "item2", "item3"];
var array3 = ["item", "item2", "item3"];

//true
array.SequenceEqual(array2);

//false
array.SequenceEqual(array3);
```

### Any

Tests if any item is in the array and if a filter is set if any item of the array matches the filter

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//true
array.Any();

//true
array.Any("i => i.length > 2");
	
//false
array.Any("i => i == ''");
```

### All

Tests if all items in the array match the condition

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//false
array.All("i => i.length > 2");
```

### Contains

Tests if array contains specific object

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//false
array.Contains("test");
```

### Concat

Combines two arrays

```javascript
var array = ["item1", "item2", "item3"];
var array2 = ["item4", "no"];

//["item1", "item2", "item3", "item4", "no"]
array.Concat(array2);
```

### Intersect

Combines two arrays but only applies values that are in both arrays

```javascript
var array = ["item1", "item2", "item3"];
var array2 = ["item1", "unique", "item2", "item3"];

//["item1", "item2", "item3"]
array.Intersect(array2);
```

### Union

Combines two arrays without duplicates

```javascript
var array = ["item1", "item2", "item3"];
var array2 = ["item1", "unique", "item2", "item3"];

//["item1", "item2", "item3", "unique"]
array.Union(array2);
```

### Join

Joins the entries by the given char

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//item1-item2-item3-item4-no
array.Join("-");

//item1-item2-item3-item4
array.Join("-", "x => x.length > 2");
```

### Aggregate

Combines the entries using a custom function

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//no-item4-item3-item2-item1
array.Aggregate("(str, item) => item + '-' + item");
```

### ToDictionary

Converts the array to a dictionary

```javascript
var array = [{OtherId: 1, Value: "item1"}, {OtherId: 2, Value: "item2"}];

//{1: {OtherId: 1, Value: "item1"}, 2: {OtherId: 2, Value: "item2"}}
array.ToDictionary("x => x.OtherId");

//{1: "item1", 2: "item2"}
array.ToDictionary("x => x.OtherId", "x => x.Value");
```

### Zip

Combines the entries of two arrays using a custom function

```javascript
var array = [0, 1, 2, 3, 4];
var array2 = ["zero", "one", "two", "three"];

//["0 zero", "1 one", "2 two", "3 three"]
array.Zip(array2, "(x, y) => x + ' ' + y");
```

### Reverse

Reverses the array

```javascript
var array = ["item1", "item2", "item3", "item4", "no"];

//["no", "item4", "item3", "item2", "item1"]
array.Reverse();
```

### Average

Computes the average of the elements

```javascript
var array = [{val: 5}, {val: 3}, {val: 1}];

//3
array.Average("x => x.val");

//4
array.Average("x => x.val", "x => x.val > 1");


var array2 = [3, 4, 5];

//4
array2.Average();
```

### Sum

Computes the sum of the elements

```javascript
var array = [{val: 5}, {val: 3}, {val: 1}];

//9
array.Sum("x => x.val");

//8
array.Sum("x => x.val", "x => x.val > 1");


var array2 = [3, 4, 5];

//12
array2.Sum();
```

### First

Returns the first item of the array and if a filter was set the first item that matches the filter - Throws an exception if no item was found

```javascript
var array = ["no", "item1", "item2", "item3", "item4", "no"];

//"no"
array.First();

//"item1"
array.First("i => i.match(/item/gi)");

//Exception
array.First("i => i == 'notgiven'");
```

### FirstOrDefault

Returns the first item of the array and if a filter was set the first item that matches the filter - returns `null` if no suitable item was found

```javascript
var array = ["no", "item1", "item2", "item3", "item4", "no"];

//"no"
array.FirstOrDefault();

//"item1"
array.FirstOrDefault("i => i.match(/item/gi)");

//null
array.First("i => i == 'notgiven'");
```

### Single

Returns the only item of the array - Throws an exception if not exactly one item is in array

```javascript
var array = ["item1"];

//"item1"
array.Single();

var array = ["item1", "item2"];

//"item1"
array.Single("x => x == 'item1'");

//Exception
array.Single();
```

### SingleOrDefault

Returns the only item of the array - Throws an exception if not only one item is in array

```javascript
var array = ["item1"];

//"item1"
array.Single();

var array = ["item1", "item2"];

//"item1"
array.Single("x => x == 'item1'");

//Exception
array.Single();

//null
array.Single("x => x == 'item3'");
```

### Min

Returns the smallest element in array

```javascript
var array = [0, 8, 1, 5, -3];

//-3
array.Min();

var array = [{name: "test", age: 3}, {name: "test2", age: 18}];

//{name: "test", age: 3}
array.Min("x => x.age");
```

### Last

Returns the last item of the array and if a filter was set the last item that matches the filter - Throws an exception if no item was found

```javascript
var array = ["no", "item1", "item2", "item3", "item4", "no"];

//"no"
array.Last();

//"item4"
array.Last("i => i.match(/item/gi)");

//Exception
array.Last("i => i == 'notgiven'");
```

### LastOrDefault

Returns the last item of the array and if a filter was set the last item that matches the filter - returns `null` if no suitable item was found

```javascript
var array = ["no", "item1", "item2", "item3", "item4", "no"];

//"no"
array.LastOrDefault();

//"item4"
array.LastOrDefault("i => i.match(/item/gi)");

//null
array.LastOrDefault("i => i == 'notgiven'");
```

### Max

Returns the greates element in array

```javascript
var array = [0, 8, 1, 5, -3];

//8
array.Max();

var array = [{name: "test", age: 3}, {name: "test2", age: 18}];

//{name: "test2", age: 18}
array.Max("x => x.age");
```

### Select

Select the properties for a new array

```javascript
var array = [{Id: 1, Value: "item1"}, {Id: 2, Value: "item2"}];
	
//["item1", "item2"]
array.Select("i => i.Value");

//[{Custom: 1, Name: "item1"}, {Custom: 2, Name: "item2"}];
array.Select("i => {Custom: i.Id, Name: i.Value}");
```

When using the string syntax it is also possible to assign objects by the following methods
```javascript
var array = [{Id: 1, Value: "item1"}, {Id: 2, Value: "item2"}];
	
//[{Value: item1}, {Value: item2}]
array.Select("i => {i.Value}");

//[{C: item1}, {C: item2}]
array.Select("i => {C: i.Value}");

//[{C: item1}, {C: item2}]
array.Select("i => {C = i.Value}");
```

### SelectMany

Select the properties with an array as value and concats them

```javascript
var array = [["item1", "item2"], ["item1", "item2"]];
	
//["item1", "item2", "item1", "item2"]
array.SelectMany("i => i");
```

### Take

Limits the number of entries taken

```javascript
var array = ["item1", "item2", "item3", "item4"];

//["item1", "item2"]
array.Take(2);
```

### TakeWhile

Takes entries as long as a condition is true

```javascript
var array = ["item1", "item2", "item3", "item2", "item4"];
var item2count = 0;

//["item1", "item2", "item3"]
array.TakeWhile(function(x){
	if(x == "item2"){
		item2count++;
	}

	return item2count < 2;
});
```

This is the basic usage. But if you want conditional executes for e.g. with counting this can get a little bit messy.

```javascript
var array = ["item1", "item2", "item3", "item2", "item4"];

//["item1", "item2", "item3"]
array.TakeWhile(function(item, storage){
	return item != "item2" || storage.count < 1; //Condition
}, function(storage){
	storage.count = 0; //Init the Storage
}, function(item, storage){
	if(item == "item2"){
		storage.count++; //After executing the condition
	}
});
```

### Skip

Skips entries

```javascript
var array = ["item1", "item2", "item3", "item4"];

//["item3", "item4"]
array.Skip(2);
```

### GroupBy

Groups array by property

```javascript
var array = [
	{name: "Max", age: 17},
	{name: "Emily", age: 54},
	{name: "max", age: 32},
	{name: "emily", age: 12}
];

//[
//	[{name: "Emily", age: 54},{name: "emily", age: 12}],
//	[{name: "Max", age: 17},{name: "max", age: 32}]
//]
array.GroupBy("i => i.name.toLowerCase()");
```

### OrderBy & OrderByDescending

Orders array by property or value

```javascript
var array = ["item3", "item1", "item2", "item4"];
	
//["item4", "item3", "item2", "item1"]
array.OrderByDescending("i => i");
	
//["item1", "item2", "item3", "item4"]
array.OrderBy("i => i");
```

Also supports complex properties

```javascript
var array = [
	{Name: "Max", Lastname: "Mustermann"},
	{Name: "John", Lastname: "Doe"},
	{Name: "Erika", Lastname: "Mustermann"}
];
	
//[{Name: "Max", Lastname: "Mustermann"},
//{Name: "Erika", Lastname: "Mustermann"},
//{Name: "John", Lastname: "Doe"}]
array.OrderByDescending("i => i.Lastname");

//[{Name: "John", Lastname: "Doe"}, 
//{Name: "Max", Lastname: "Mustermann"},
//{Name: "Erika", Lastname: "Mustermann"}]
array.OrderBy("i => i.Lastname");
```

### ThenBy & ThenByDescending

Orders array by additional properties in combination with OrderBy/OrderByDescending

```javascript
var array = [
	{Name: "Max", Lastname: "Mustermann"},
	{Name: "John", Lastname: "Doe"},
	{Name: "Erika", Lastname: "Mustermann"}
];
	
//[{Name: "Erika", Lastname: "Mustermann"},
//{Name: "Max", Lastname: "Mustermann"},
//{Name: "John", Lastname: "Doe"}]
array.OrderByDescending("i => i.Lastname").ThenBy("i => i.Name");
```

### Move

Moves an item from one index to another

```javascript
var array = ["item1", "item2", "item3", "item4"];

//["item1", "item3", "item4", "item2"]
array.Move(1, 3);
```

### Distinct

Makes all values unique using the specified selector

```javascript
var array = ["item1", "item2", "item2", "item3", "item4"];

//["item1", "item2", "item3", "item4"]
array.Distinct("x => x");
array.Distinct();
```

### Evaluate

Evaluates SQL-String for array

```javascript
var array = [...];

array.Evaluate("...");
```

Example SQL-string

```
clone
reverse
where x => x.Age > 70
order by x => x.Name
then by x => x.FirstName descending
for each x => console.log(x)
select x => {x.Name}
```

Supported methods (the methodname and aliases are not case-sensitive)

| Methodname        | Alias                                                                                                                                 | Examples                         |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| Clone             |                                                                                                                                       | clone                            |
| Reverse           |                                                                                                                                       | reverse                          |
| Contains          |                                                                                                                                       | contains 5                       |
| Join              |                                                                                                                                       | join 5                           |
| Sum               |                                                                                                                                       | sum                              |
| Average           |                                                                                                                                       | average                          |
| Where             |                                                                                                                                       | where x => x.Id > 3              |
| Select            |                                                                                                                                       | select x => x.Id                 |
| SelectMany        | select many<br> select ... many                                                                                                       | select many x => x.Pets          |
| Get               |                                                                                                                                       | get 4                            |
| ForEach           | for each                                                                                                                              | for each x => console.log(x)     |
| Count             |                                                                                                                                       | count x => x.Id                  |
| All               |                                                                                                                                       | all x => x.Age > 4               |
| Any               |                                                                                                                                       | any x => x.Age > 4               |
| Take              |                                                                                                                                       | take 3                           |
| TakeWhile         | take while<br> take ... while                                                                                                         | take while x => x.Age > 10       |
| Skip              |                                                                                                                                       | skip 3                           |
| Min               |                                                                                                                                       | min x => x.Age                   |
| Max               |                                                                                                                                       | max x => x.Age                   |
| GroupBy           | group by                                                                                                                              | group by x => x.Name             |
| Distinct          |                                                                                                                                       | distinct x => x.Id               |
| FindLastIndex     | find last index<br>find index ... last<br>findindex ... last                                                                          | find index x => x.Age == 3 last  |
| FindIndex         | find index<br>find first index<br>findfirstindex<br>find index ... first<br>findindex ... first                                       | find index x => x.Age == 3 first |
| OrderByDescending | order by ... descending<br>orderby ... descending<br>orderby descending<br>order by descending<br>orderbydescending                   | order by x => x.Age descending   |
| OrderBy           | order by ... ascending<br>orderby ... ascending<br>orderby ascending<br>order by ascending<br>orderbyascending<br>order by<br>orderby | order by x => x.Age ascending    |
| FirstOrDefault    | first or default                                                                                                                      | first or default                 |
| LastOrDefault     | last or default                                                                                                                       | last or default                  |
| SingleOrDefault   | single or default                                                                                                                     | single or default                |
| First             |                                                                                                                                       | first                            |
| Last              |                                                                                                                                       | last                             |
| Single            |                                                                                                                                       | single                           |
| ThenByDescending  | thenby ... descending<br>then by ... descending<br>thenbydescending<br>then by descending                                             | then by x => x.Name descending   |
| ThenBy            | thenby ... ascending<br>then by ... ascending<br>thenbyascending<br>then byascending<br>thenby<br>then by                             | then by x => x.Name ascending    |

## Author

[Morris Janatzek](http://morrisj.net) ([morrisjdev](https://github.com/morrisjdev))
