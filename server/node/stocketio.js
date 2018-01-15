/**
 * 
 * 由...暴露require('socket.io')。

＃新服务器（httpServer [，选项]）
httpServer （http.Server）要绑定的服务器。
options （目的）
path （String）：要捕获的路径的名称（/socket.io）
serveClient （布尔）：是否提供客户端文件（true）
adapter （适配器）：适配器使用。默认为一个Adapter基于内存的socket.io 的实例。请参阅socket.io-适配器
origins （String）：允许的起点（*）
parser （Parser）：解析器使用。默认为Parsersocket.io附带的一个实例。请参阅socket.io解析器。
适用于和不适用new：

const io = require('socket.io')();
// or
const Server = require('socket.io');
const io = new Server();
传递给socket.io的选项总是传递给engine.io Server被创建的。请参阅engine.io 选项。

在这些选项中：

pingTimeout （数字）：多少毫秒没有乒乓包考虑连接关闭（60000）
pingInterval （数字）：在发送新的ping数据包（25000）之前多少ms 。
这两个参数将影响客户端知道服务器不再可用之前的延迟。例如，如果由于网络问题导致基础TCP连接没有正确关闭，则客户端pingTimeout + pingInterval在获取disconnect事件之前可能不得不等待ms 。

transports （Array <String>）：传输以允许连接到（['polling', 'websocket']）。
注意：顺序很重要。默认情况下，首先建立一个长轮询连接，如果可能的话，升级到WebSocket。['websocket']如果WebSocket连接无法打开，使用方法将不会回退。
*/
var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
    console.log('connection');
  client.on('event', function(data){

        console.log(data);
  });
  client.on('disconnect', function(){

    console.log('disconnect');
  });
});
server.listen(8124);