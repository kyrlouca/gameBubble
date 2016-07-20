"use strict";
class Car {
    constructor(make,age) {

        this.make = make;

        let pap=100;
        this.papShow=function(){return pap;};
        this.papInc=function(){pap++;};

        let _age=age;
        this.ageShow=function(){return _age;};
        this.ageInc=function(){_age++;};
    }
    get getMake() {
        return this.make + ' '+ this.papShow(); // call the function because no access to pap property in constructor
    }
    showDetail(){
        return this.make + ' '+ this.papShow() +' '+ this.ageShow();
    }
}

var bmw=new Car('bmw',4 );
bmw.papInc();
bmw.ageInc();
console.log(bmw.showDetail()); //bmw 101 5

var honda=new Car('honda',12 );
console.log(honda.showDetail());//honda 100 12
