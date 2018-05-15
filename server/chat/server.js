var express = require('express');
var app = express();
var http = require('http').Server(app);
const opn = require('opn');
const path=require('path')
const args=require('yargs').default('open',false).argv;
const root=path.resolve(__dirname,'../../')
var io = require('socket.io')(http);


app.get('/', function (req, res) {
    res.sendFile(path.resolve(root,'www/chat/index.html'))
});

app.get('/getMessage', function (req, res) {
    res.json({
        chatMessage:chatMessage
    });
});


var chatMessage=[];

io.on('connection', function(socket){
    console.log('a user connected');

    
    socket.on('chatMessage', function(data){
        chatMessage.push({
                username:data.username,
                msg:data.msg,
                sendTime:data.sendTime
        });
      //  socket.client.emit('postMessage',data);
       // console.log(data);
        //socket.emit('postMessage',data)
    });
});
  
http.listen(5888,()=>{
    console.log('服务已启动');
    if(args.open)
    {
         opn('http://localhost:5888/', {app: 'chrome'});
    }
  });
  