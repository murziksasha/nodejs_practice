const httpServer = require('http').createServer();
const fsys = require('fs');

httpServer.on('request', (req, res) => {
  //Solution 1: read the entire file into memory

  // fsys.readFile('./test-file.txt', (err, data) => {
  //   if (err) {
  //     res.writeHead(500, { 'Content-Type': 'text/plain' });
  //     res.end('Server Error');
  //     return;
  //   }
  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.end(data);
  // });

  // Solution 2: create streams

  // const fileStream = fsys.createReadStream('./test-file.txt');
  // fileStream.on('data', (chunk) => {
  //   res.write(chunk);
  // });
  // fileStream.on('end', () => {
  //   res.end();
  // });
  // fileStream.on('error', (err) => {
  //   res.writeHead(500, { 'Content-Type': 'text/plain' });
  //   res.end('File not found');
  // });

  // Solution 3: pipe streams

  const fileStream = fsys.createReadStream('./test-file.txt');
  res.writeHead(200, { 'Content-Type': 'text/plain' }); 
  fileStream.pipe(res);
  fileStream.on('error', (err) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
  });
  fileStream.on('end', () => {
    res.end();
  });
  fileStream.on('close', () => {
    console.log('File stream closed');
  });
  fileStream.on('open', () => {
    console.log('File stream opened');
  });
  fileStream.on('pause', () => {
    console.log('File stream paused');
  });
  fileStream.on('resume', () => {
    console.log('File stream resumed');
  });
  fileStream.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data`);
  });
  


}); 

httpServer.listen(8000, () => {
  console.log('Server is listening on port 8000');
});