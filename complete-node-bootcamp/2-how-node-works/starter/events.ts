const EventEmitter = require('events');

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


myEmitter.on('newSale', () => {
  console.log('A new sale has occurred!');
});

myEmitter.on('greet', () => {
  console.log('Hello World!');
});

myEmitter.emit('newSale');