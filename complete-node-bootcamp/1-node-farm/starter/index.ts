const fs = require('fs');
const http = require('http');
const url = require('url');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${new Date().toLocaleString('uk-UA')}`;

// fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
// console.log('File written successfully!');

// fs.readFile('./txt/output.txt', 'utf-8', (err, data) => {
//   if (err) {
//     console.log('Error reading file:', err);
//     return;
//   }
//   console.log('File content:', data);
// });
// console.log('Reading file...');

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if(pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW');
  } else if(pathName === '/product') {
    res.end('This is the PRODUCT');
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is running on port 8000');
});
