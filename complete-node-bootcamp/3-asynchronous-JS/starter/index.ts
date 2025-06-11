const fs = require('fs');
const superagent = require('superagent');

fs.readFile('dog.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body);
      fs.writeFile('dog-img.txt', res.body.message, (err) => {
        if (err) {
          console.error('Error writing file', err);
          return;
        }
        console.log('Rand dog image saved to file');
      });
    })
    .catch((err) => {
      console.error('Error fetching dog image:', err);
    });
});
