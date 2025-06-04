const EventEmitter = require('events');
const http = require('http');

class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.on('newListener', (event, listener) => {
      console.log(`New listener added for event: ${event}`);
    });
    this.on('removeListener', (event, listener) => {
      console.log(`Listener removed for event: ${event}`);
    });
  }
}

const myEmitter = new MyEmitter();

myEmitter.on('newSale', (item) => {
  console.log('A new sale has occurred!', item);
});

myEmitter.on('newSale', (item) => {
  console.log(`Another listener for newSale event! ${item}`);
});

myEmitter.on('greet', () => {
  console.log('Hello World!');
});

myEmitter.emit('newSale', 99);

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received!');
  console.log('Another request received! 💕📞👌❌');
  res.end('Request received! 💕📞👌❌');
});

server.on('close', () => {
  console.log('Server closed!');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server is listening on port 3000');
});
