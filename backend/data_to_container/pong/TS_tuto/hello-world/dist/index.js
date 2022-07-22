"use strict";
console.log('Hello world');
let age = 20;
if (age < 50)
    age += 10;
console.log(age);
let sales = 123456789;
let course = 'TypeScript';
let is_published = true;
let saless = 123456789;
let coursee = 'TypeScript';
let is_publishedd = true;
let numbers = [1, 2, 3];
let empty_nb_arr = [];
let anyarr = [];
numbers.forEach(element => element.toString);
numbers.forEach(element => console.log(element));
let user = [1, 'Clem'];
var Size;
(function (Size) {
    Size[Size["Small"] = 0] = "Small";
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Large"] = 2] = "Large";
})(Size || (Size = {}));
;
;
let mySize = Size.Medium;
console.log(mySize);
let mySizes = 2;
console.log(mySizes);
function calculateTax(income, taxYear = 2022) {
    if ((taxYear) < 2022)
        return income * 1.2;
    return income * 1.3;
}
console.log(calculateTax(1234, 2020));
let employee = {
    id: 1,
    name: 'Ted',
    retire: (date) => {
        console.log("date = ", date);
    }
};
employee.name = 'Ben';
employee.retire(new Date);
function kgToLbs(weight) {
    if (typeof weight === 'number') {
        console.log('Number convert');
        return weight * 2.2;
    }
    else {
        console.log('String convert');
        return parseInt(weight) * 2.2;
    }
}
let test_union;
console.log(kgToLbs(50));
console.log(kgToLbs('50kg'));
let textBox = {
    drag: () => { },
    resize: () => { }
};
textBox.drag();
let quantity = 50;
console.log(quantity);
function greet(name) {
    if (name)
        console.log(name.toUpperCase());
    else
        console.log('Hola!');
}
greet('Eric');
greet(null);
function getCustomer(id) {
    return id === 0 ? null : { birthday: new Date() };
}
let customer = getCustomer(0);
console.log(customer === null || customer === void 0 ? void 0 : customer.birthday);
customer = getCustomer(1);
console.log(customer === null || customer === void 0 ? void 0 : customer.birthday);
//# sourceMappingURL=index.js.map