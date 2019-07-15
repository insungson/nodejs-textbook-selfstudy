var x1 = "global";

function f1(){

    console.log(x1); //undefined가 뜬다...

    var x1 = "local";

    console.log(x1); // local이 뜬다.
    return x1;
}



console.log(f1()); // undefined 리턴값이 없어서 그런것이다.