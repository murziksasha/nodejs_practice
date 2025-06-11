const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(`I could not find that file 😢, reason: ${err}`);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {   
      if (err) {
        reject(`Could not write file 😢, reason: ${err}`);
      } else {
        resolve('File written successfully: ' + data);
      }
    });
  });
}

readFilePromise(`${__dirname}/dog.txt`).then((data) => { 
  console.log(`Breed: ${data}`);
  return superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body);
      return writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message)
    .then(data => {
      console.log(`this is writted to file: ${data}`);
    })
    .catch((err) => {
      console.error('Error fetching dog image:', err);
    });
});
});