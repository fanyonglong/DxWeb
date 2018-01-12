/*
res.set(field [, value])
Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.

res.set('Content-Type', 'text/plain');

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  'ETag': '12345'
})
Aliased as res.header(field [, value]).

res.status(code)
Use this method to set the HTTP status for the response. It is a chainable alias of Node’s response.statusCode.

res.status(403).end();
res.status(400).send('Bad Request');
res.status(404).sendFile('/absolute/path/to/404.png');
res.type(type)
Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type. If type contains the “/” character, then it sets the Content-Type to type.

res.type('.html');              // => 'text/html'
res.type('html');               // => 'text/html'
res.type('json');               // => 'application/json'
res.type('application/json');   // => 'application/json'
res.type('png'); 
*/
var express = require('express');
var app = express();
var http=require('http');
const opn = require('opn');
const args=require('yargs').default('open',false).argv;
const path=require('path');
const { StringDecoder } = require('string_decoder');
var rootPath=path.resolve(__dirname,'../../www/express-site');
// respond with "hello world" when a GET request is made to the homepage


/***
 * 路由执行顺序
 * application[method]
 * router/index.js/route
 * router/route.js/[method]
 * 
*/


app.use('/assets', express.static(path.join(rootPath,'assets')));
// app.get('/assets/*', function(req, res) {
//   res.sendFile(req.url,{
//     root:rootPath
//   });
// });

// 中间件拦截
// app.use(function(req,res,next){

//   if(req.url.indexOf('/assets')==0)
//   {
//     res.sendFile(req.url,{
//       root:rootPath
//     });
//   }else{
//     next();
//   }
 
// })



app.all('/getList',function(req,res){
  console.log(req.query.timeout);
if(req.query.timeout&&req.query.timeout>0)
{
  setTimeout(function(){
    res.json({
      retStatus:200,
      data:['aaa','bbbb']
    });
  },Number(req.query.timeout));
  }else{
    res.json({
      retStatus:200,
      data:['aaa','bbbb']
    });
}
});
app.all('/getList2',function(req,res,next){
  res.contentType('')
    res.writeHead(500,"send fail")
    res.end('请求的接口不正确');
  //res.statusMessage='请求的接口不正确';
 // res.status(400).end();
 //res.statusMessage='请求的接口不正确';
//res.status(500).end();
 // res.statusMessage="send fail";
 //res.statusCode=500;
 //res.status(500).send('请求的接口不正确');

 // res.send(500,{ error: 'something blew up' });
  // res.json({
  //   retStatus:200,
  //   data:['aaa','bbbb']
  // });

});
app.all('/getList3',function(res,res,next){
  //req.accepts
  res.format({
    'text/plain': function(){
      res.send('hey');
    },
  
    'text/html': function(){
      res.send('<p>hey</p>');
    },
  
    'application/json': function(){
      res.send({ message: 'hey' });
    },
  
    'default': function() {
      // log the request and respond with 406
      res.status(406).send('Not Acceptable');
    }
  });

})

app.get('/', function(req, res) {
  res.sendFile('index.html',{
    root:rootPath
  });
});

// 错误中间件
app.use(function(err, req, res, next){
  if(err){
    var code = err.code;
      var message = err.message;
      res.writeHead(code, message, {'content-type' : 'text/plain'});
      res.end(message);
  }else{
    next();
  }
});


// npm run web -- --open
app.listen(5888,()=>{
  console.log('服务已启动');
  if(args.open)
  {
  opn('http://localhost:5888/', {app: 'chrome'});
  }
});



/*
[ 'ACL',
  'BIND',
  'CHECKOUT',
  'CONNECT',
  'COPY',
  'DELETE',
  'GET',
  'HEAD',
  'LINK',
  'LOCK',
  'M-SEARCH',
  'MERGE',
  'MKACTIVITY',
  'MKCALENDAR',
  'MKCOL',
  'MOVE',
  'NOTIFY',
  'OPTIONS',
  'PATCH',
  'POST',
  'PROPFIND',
  'PROPPATCH',
  'PURGE',
  'PUT',
  'REBIND',
  'REPORT',
  'SEARCH',
  'SUBSCRIBE',
  'TRACE',
  'UNBIND',
  'UNLINK',
  'UNLOCK',
  'UNSUBSCRIBE' ]
*/
//console.log(http.METHODS);