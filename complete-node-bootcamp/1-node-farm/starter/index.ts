const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
// Importing the replaceTemplate function
const replaceTemplate = require('./modules/replaceTemplate');

const data = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);
// Slugify the product names
const slugs = dataObj.map((el) =>
  el.slug = slugify(el.productName, { lower: true })
);
console.log(slugs);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const { pathname, query } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(
      /{%PRODUCT_CARDS%}/g,
      cardsHtml
    );
    res.end(output);
    // Product page
  } else if (pathname.startsWith('/product/')) {
  const slug = pathname.replace('/product/', '');
  const product = dataObj.find(el => el.slug === slug);
      if (product) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('<h1>Product not found</h1>');
  }

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is running on port 8000');
});
