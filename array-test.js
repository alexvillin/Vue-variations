var a = Array.isArray();


console.log(
    // all following calls return true
    Array.isArray([]),
    Array.isArray([1]),
    Array.isArray(new Array()),
    Array.isArray(new Array('a', 'b', 'c', 'd')),
    Array.isArray(new Array(3)),
    // Little known fact: Array.prototype itself is an array:
    Array.isArray(Array.prototype),

    // all following calls return false
    Array.isArray(),
    Array.isArray({}),
);

var iframe = document.createElement('iframe');
var child = document.body.appendChild(iframe);
xArray = window.frames[window.frames.length - 1].Array;
var arr = new xArray(1, 2, 3); // [1,2,3]

// Correctly checking for Array
Array.isArray(arr); // true
// Considered harmful, because doesn't work through iframes
arr instanceof Array;