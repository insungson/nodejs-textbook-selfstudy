const {odd,even} = require('./var');
const checkNumber = require('./func');

function checkStringOddOrEvan(str){
    if(str.length % 2){ //홀수면 
        return odd;
    }
    return even;
}

console.log(checkStringOddOrEvan('hello'));
console.log(checkNumber(10));
console.log(10%2);