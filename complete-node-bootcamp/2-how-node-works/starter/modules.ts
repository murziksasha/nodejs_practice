// console.log(arguments)
// console.log(require('module').wrapper);

// const c = require('./test-module.js');

// const calc1 = new c();
// console.log(calc1.add(5, 3)); // 8

// const {add, multiply, divide} = require('./test-module2.js');
// console.log(add(5, 3));      // 8
// console.log(multiply(5, 3)); // 15
// console.log(divide(5, 3));   // 1.6666666666666667


// caching
require('./test-module3.js')(); // first time
require('./test-module3.js')(); // second time, cached
require('./test-module3.js')(); // third time, cached
// const testModule3 = require('./test-module3.js');
