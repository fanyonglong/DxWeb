// var net = require('net');

// var HOST = '127.0.0.1';
// var PORT = 8124;

// var server = net.createServer();
// server.listen(PORT);

// server.on('connection', function(sock) {

//     console.log('CONNECTED: ' +
//          sock.remoteAddress +':'+ sock.remotePort);
//     // 其它内容与前例相同

// });


const net = require('net');
const server = net.createServer((sock) => {
  // 'connection' listener
  console.log('client connected');
  sock.on('connect',()=>{

    console.log('connected');
  })
  sock.on('end', () => {
    console.log('client disconnected');
  });
  // 为这个socket实例添加一个"data"事件处理函数
  sock.on('data', function(data) {
      console.log('data:');
  //  console.log('DATA ' + sock.remoteAddress + ': ' + data);
    // 回发该数据，客户端将收到来自服务端的数据
    //sock.write('You said "' + data + '"');
 });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ');
    });
 //  sock.connect();
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});

