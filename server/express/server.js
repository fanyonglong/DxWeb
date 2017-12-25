var express = require('express');
var app = express();
var http=require('http');
const opn = require('opn');
const args=require('yargs').default('open',false).argv;
const path=require('path');
var rootPath=path.resolve(__dirname,'../../www/express-site');
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.sendFile('index.html',{
    root:rootPath
  });
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