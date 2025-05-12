const fs = require('fs');

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');


const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${new Date().toLocaleString('uk-UA')}`;

fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
console.log('File written successfully!');

fs.readFile('./txt/output.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});
console.log('Reading file...');