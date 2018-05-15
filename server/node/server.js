
//  npm run nodeweb -- --open
const http=require('http');
const EventEmitter = require('events');
const util = require('util');
const path=require('path');
const pathToRegexp =require('path-to-regexp');
const fs=require('fs');
const args=require('yargs').boolean('open').argv;
const mime=require('mime');
const opn=require('opn');
const child_process=require('child_process');
console.log(args.open);
var App=(function(){
    var routers=[];
    class Router{
        constructor(path,handle)
        {
              this.path=pathToRegexp(path,this.keys=[]);
              this._handle=handle;
              this.args=[];
        }
        exec(path)
        {
            let result=this.path.exec(path);
            if(result)
            {
                this.args=Array.from(result).slice(1);
            }
            return result;
        }
        handle(req,res,next)
        {
            if(this._handle.length==3)
            {
                this._handle(req,res,next)
            }else{
                this._handle(req,res)
                next();
            }
        }
        
    }
    function App(req,res)
    {   
        App.handle(req,res);
    }
    App._events={};
    Object.assign(App,EventEmitter.prototype);
    App.handle=function(req,res)
    {
        let path=req.url;
        let routerlist= routers.filter(item=>item.exec(path));
        let index=0;
        function next(error)
        {
            if(error)
            {
                return;
            }
             if(index<routerlist.length)
             {
                 let router=routerlist[index++];
                 router.handle(req,res,next);
             }
        }           
        next(null);  
    }
    App.init=function()
    {
        App.use(function(req,res){
            res.req=req;
            req.res=res;
            Reflect.setPrototypeOf(req,App.request);
            Reflect.setPrototypeOf(res,App.response);
        });
    }
    App.use=handler=>{
        let router=new Router('(.*)',handler);
        router.use=true;
        let index=routers.slice().reverse().findIndex(item=>item.use===true);
        routers.splice(index+1,0,router);
    };
    App.router=(path,handler)=>
    {
        routers.push(new Router(path,handler));
    }
    App.request=Object.assign(Object.create(http.IncomingMessage.prototype),{

    });
    App.response=Object.assign(Object.create(http.ServerResponse.prototype),{
        sendFile(filePath)
        {
            try{
                let req=this.req;
              //  let accept=req.getHeader('Accept');
                let contentType = this.getHeader('Content-Type');
                if(!contentType)
                {
                    contentType=mime.getType(path.extname(filePath));
                }
                if(!fs.existsSync(filePath))
                {
                        this.statusCode =404;
                        this.end();
                        return;
                }
   
                var data='', rs=fs.createReadStream(filePath,{
                    flags: 'r',
                    encoding: 'utf-8',
                    fd: null,
                    mode: 0o666,
                    autoClose: true
                });

                rs.on('data',chunk=>{
                    data+=chunk;
                });
                rs.on('end',()=>{
                    this.writeHead(200, {
                        'Content-Length': Buffer.byteLength(data),
                        'Content-Type': contentType });                  
                        this.end(data);
                });
            }catch(e)
            {
                this.statusCode =500;
                this.end(e);
                return;
            }
           
        },
        json(data)
        {
            data=JSON.stringify(data);
            this.writeHead(200, {
                'Content-Length': Buffer.byteLength(data),
                'Content-Type': 'application/json' });
                this.end(data,'utf-8');
        }
    });
    App.init(); 
    return App;
}());
var server=http.createServer(App);

App.use((()=>{
    let static=pathToRegexp('/assets/(.*)')
    return function(req,res,next){
        if(static.test(req.url))
        {
            res.sendFile(path.resolve(__dirname,'../../www/express-site/'+req.url))
        }else{
            next();
        }
    }
})());
App.router('/',function(req,res){
    res.sendFile(path.resolve(__dirname,'../../www/express-site/index.html'))
});
App.router('/list',function(req,res){
    res.json({list:[1,2,3,4]});
});



server.on('close',function(){

    console.log('close server');
});

server.listen(5888,function(){
    console.log('服务已启动');
 
    let childp=child_process.exec('node ./server/node/stocket.js',{
    // cwd:__dirname
    },(e)=>{
        console.log('stocket关闭');
        if(e)
        {
            console.log(e);
        }
    });
  

    if(args.open)
    {
        opn('http://localhost:5888/', {app: 'chrome'});
    }
  
});
// process.on('SIGINT', function() {
//      if(childp)
//      {
//         setImmediate(()=>{
//             childp
//         })
//      }
//      console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
//  });
// process.on('SIGTERM',()=>{
//     console.log('44444444');
// });

    // child_process.exec('node ./server/node/stocket.js',{
    // // cwd:__dirname
    // },(e)=>{
    //     console.log('stocket关闭');
    //     if(e)
    //     {
    //         console.log(e);
    //     }

    // });
 
  