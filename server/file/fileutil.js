const http=require('http');
const EventEmitter = require('events');
const util = require('util');
const path=require('path');
const pathToRegexp =require('path-to-regexp');
const fs=require('fs');
const args=require('yargs').default('open',false).argv;


var filePath=path.resolve(__dirname,'../../www/express-site/index.html');

var rs=fs.createReadStream(filePath,{
   // defaultEncoding:"Buffer",
 //   encoding:'utf-8' //Buffer
});

rs.on('data',(data)=>{

console.log('data'+data);
});

rs.on('end',(data)=>{
    console.log('end');
});