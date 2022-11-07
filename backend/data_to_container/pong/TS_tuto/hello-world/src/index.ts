
import fetch from 'node-fetch';
fetch("");




//https://www.youtube.com/watch?v=d56mG7DezGs&t=1822s&ab_channel=ProgrammingwithMosh
//async / await
// to avtivave if you dont want unuesed var
    //"noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */


console.log('Hello world');
let age: number = 20;
if (age < 50)
    age += 10;
console.log(age)

let sales: number = 123_456_789;
let course: string = 'TypeScript';
let is_published: boolean = true;
let saless = 123_456_789;
let coursee = 'TypeScript';
let is_publishedd = true;

//avoid any type
//we can disable compil error by adding : noImplicityAny = false to the config

// let level;
// level = 1;
// level = 'a';
// 
// function any_fct(any_var) {
// console.log(any_var);
// }
// to force compile type any in the args : 
//function any_fct(any_var: any) {

let numbers: number[] = [1, 2, 3];
let empty_nb_arr: number[] = [];
let anyarr = [];
numbers.forEach(element => element.toString);
numbers.forEach(element => console.log(element));

//Tuples
//best to have ony two value
let user: [number, string] = [1, 'Clem'];

//enum Pascal case
enum Size { Small = 0, Medium, Large };
//compiler generate more optimize code in js
const enum Sizes { Small = 1, Medium = 2, Large = 3 };
let mySize: Size = Size.Medium;
console.log(mySize);
let mySizes: Sizes = Sizes.Medium;
console.log(mySizes);

//function
function calculateTax(income: number, taxYear = 2022): number {
    // function calculateTax(income: number, taxYear?: number) :number {
    //si taxyear non fourni. valeur par defaut 2022
    //if ((taxYear || 2022) < 2022)
    if ((taxYear) < 2022)
        return income * 1.2;
    return income * 1.3;
}

console.log(calculateTax(1234, 2020));

//type alias
type Employee = {
    readonly id: number,
    name: string,
    fax?: number,
    retire: (date: Date) => void
}

let employee: Employee = {
    id: 1,
    name: 'Ted',
    retire: (date: Date) => {
        console.log("date = ", date);
    }
}
employee.name = 'Ben';
employee.retire(new Date);

//UNION TYPE - function with two different type
function kgToLbs(weight: number | string): number {
    if (typeof weight === 'number') {
        console.log('Number convert');
        return weight * 2.2;
    }
    else {
        console.log('String convert');
        return parseInt(weight) * 2.2;
    }
}
//UNIION TYPE
let test_union: number | string;

console.log(kgToLbs(50));
console.log(kgToLbs('50kg'));

type Draggable = {
    drag: () => void
};

type Resizable = {
    resize: () => void
};

//INTERSECTION TYPE
type UIwidget = Draggable & Resizable;

let textBox: UIwidget = {
    drag: () => { },
    resize: () => { }
}
textBox.drag();

// LITERAL TYPES
type Quantity = 50 | 100;
let quantity: Quantity = 50;
//Impossible because 52 is not 50 or 100
//let quantity2: Quantity  = 52;
console.log(quantity);



function greet(name: string | null): void {
    if (name)
        console.log(name.toUpperCase());
    else
        console.log('Hola!');
}

greet('Eric');
greet(null);

type Customer = {
    birthday?: Date
};

function getCustomer(id: number) : Customer | null | undefined {
    return id === 0 ? null : {birthday: new Date()}
}
let customer = getCustomer(0);
console.log(customer?.birthday?.getFullYear());
customer = getCustomer(1);
console.log(customer?.birthday?.getFullYear());