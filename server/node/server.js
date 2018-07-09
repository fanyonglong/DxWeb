
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
/*
创建一个Server服务应用层
**/
var App=(function(){
    var routers=[];
    /**
     * 创建http请求路由处理类
    */
    class Router{
        /**
         * 
         * @param {string} path  匹配路径
         * @param {function} handle  处理函数
         */
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
    /**
     * 
     * @param {httpRequest} req  请求对象 
     * @param {httpResponse} res 响应对象
     */
    function App(req,res)
    {   
        //监听服务请求
        App.handle(req,res);
    }
    App._events={};
    // 继承node 事件机制
    Object.assign(App,EventEmitter.prototype);
    App.handle=function(req,res)
    {
        let path=req.url;
        let routerlist= routers.filter(item=>item.exec(path));// 根据请求路径查找对应处理路由
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
            res.req=req;// 原始request
            req.res=res;// 原始response
            Reflect.setPrototypeOf(req,App.request);// 继承自定义request
            Reflect.setPrototypeOf(res,App.response);// 继承自定义response
        });
    }
    /**
     * 创建代理层
     * @param {function} handler  处理函数
     */
    App.use=handler=>{
        let router=new Router('(.*)',handler);// 所有路径都处理
        router.use=true;
        let index=routers.slice().reverse().findIndex(item=>item.use===true);// 插入到其它的use后面
        routers.splice(index+1,0,router);
    };
    /**
     * 创建一个路由
     * @param {string} path  路径
     * @param {function} handler 
     */
    App.router=(path,handler)=>
    {
        routers.push(new Router(path,handler));
    }
    /**
     * 扩展http 原始request 对象
    */
    App.request=Object.assign(Object.create(http.IncomingMessage.prototype),{

    });
      /**
     * 扩展http 原始response 对象
    */
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

App.use((()=>{
    let static=pathToRegexp('/assets/(.*)')
    return function(req,res,next){
        // 如果请求路径是静态资源，直接拦载，响应输出
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

// 创建一个http服务器
var server=http.createServer(App);


server.on('close',function(){

    console.log('close server');
});
// 开始启动监听
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
 
  