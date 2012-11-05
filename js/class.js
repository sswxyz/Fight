/*************************************************************************
 Author: sswxyz (sswxyza@gmail.com)
 Created Time: Mon 05 Nov 2012 10:20:53 AM CST
 File Name: class.js
 Description: 
 ************************************************************************/
function Shape () {
};
Shape.prototype.GetArea = function () {
    console.log(this.area);
    return this.area;
}

Shape.prototype.GetParameter = function () {
    console.log(this.parameter);
    return this.parameter;
}

Shape.prototype.Name = function () {
    console.log("Shape~~");
}

function Circle (r) {
    this.area = Math.PI * r * r;
    this.parameter = 2 * Math.PI * r;
    this.Name = function () {
        console.log("Circle~~")  
    };
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
Circle.prototype.baseClass = Shape.prototype.constructor;
Circle.prototype.Name = Circle.Name;

function Rectangle(x, y) {
    this.area = x * y;
    this.parameter = 2 * (x + y);
    this.Name = function () {
        console.log("Rectangle~~");
    }
}

Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.baseClass = Shape.prototype.constructor;
Rectangle.prototype.Name = Rectangle.name;

var c1 = new Circle(1);
var r1 = new Rectangle(2,4);

c1.GetArea();
c1.GetParameter();
c1.Name();

r1.GetArea();
r1.GetParameter();
r1.Name();
