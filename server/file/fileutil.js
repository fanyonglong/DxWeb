const http=require('http');
const EventEmitter = require('events');
const util = require('util');
const path=require('path');
const pathToRegexp =require('path-to-regexp');
const fs=require('fs');
const args=require('yargs').default('open',false).argv;


var filePath=path.resolve(__dirname,'../../www/index.html');

var rs=fs.createReadStream(filePath,{
    encoding:'utf-8'
});

// rs.on('data',(data)=>{

// console.log('data');
// });

// rs.on('end',(data)=>{
//     console.log('end');
// });