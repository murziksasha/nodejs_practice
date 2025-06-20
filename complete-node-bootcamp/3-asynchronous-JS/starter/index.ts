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
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    console.log(res.body.message);
    await writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message);
    console.log('Random dog image saved to file successfully!');
  } catch (err) {
    throw err;
  }
  console.log('2: Ready 🐩');
};
console.log('1: Will get dog pics!');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting dog pics!');
  })
  .catch((err) => {
    console.error('Error:', err);
  });

/*
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
*/
