/*************************************************************************
 Author: sswxyz (sswxyza@gmail.com)
 Created Time: Fri 02 Nov 2012 05:16:17 PM CST
 File Name: fibmem.js
 Description: 
 ************************************************************************/
var fib = function (n) {
    if (n < 3) return 1;
    return fib(n-1) + fib(n-2);
}

var memorize = function (fn) {
    var cache = {};
    var fibm = function () {
        var n = arguments[0];
        cache[n] = cache[n] || fn(n);
        return cache[n];
    }
    fibm.orig = fn;
    return fibm;
}

fib = memorize(fib);
console.log(fib(40));
console.log(fib(5));

fib = fib.orig;
