const fs = require('fs');
const myCrypto = require('crypto');

const start = Date.now();

setTimeout(() => {
  console.log('Timer 1 executed');
}, 0);

setImmediate(() => {
  console.log('Imeediate 1 finished');
});

fs.readFile('./test-file.txt', () => {
  console.log('I/O finished');
  console.log('-------------------');

  setTimeout(() => {
    console.log('timer 3 executed, after 3 seconds');
  }, 3000);

  setTimeout(() => {
    console.log('Timer 2 executed');
  }, 0);

  setImmediate(() => {
    console.log('Immediate 2 finished');
  });

  process.nextTick(() => {
    console.log('Process next tick');
  });

  myCrypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(
      `Call back took ${(Date.now() - start) / 1000} seconds`,
      'Password encrypted'
    );
  });

  myCrypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(
      `Call back took ${(Date.now() - start) / 1000} seconds`,
      'Password encrypted'
    );
  });

  myCrypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(
      `Call back took ${(Date.now() - start) / 1000} seconds`,
      'Password encrypted'
    );
  });

  myCrypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(
      `Call back took ${(Date.now() - start) / 1000} seconds`,
      'Password encrypted'
    );
  });

    myCrypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Synchronous password encryption done');

        myCrypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Synchronous password encryption done');

        myCrypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Synchronous password encryption done');

});

console.log('Hello from the top-level code');
