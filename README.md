# node 服务器
- express web服务器
  - [路由](#express路由)
- node 同构渲染

## express 环境塔建
`npm install express --save  ` [express](#https://www.npmjs.com/package/express)

首先假定你已经安装了 Node.js，接下来为你的应用创建一个目录，然后进入此目录并将其作为当前工作目录。
```bash
$ mkdir myapp
$ cd myapp
```
通过 npm init 命令为你的应用创建一个 package.json 文件。 欲了解 package.json 是如何起作用的，请参考 Specifics of npm’s package.json handling。
```bash
$ npm init
```
此命令将要求你输入几个参数，例如此应用的名称和版本。 你可以直接按“回车”键接受默认设置即可，下面这个除外：
```bash
entry point: (index.js)
```
键入 app.js 或者你所希望的名称，这是当前应用的入口文件。如果你希望采用默认的 index.js 文件名，只需按“回车”键即可。

接下来安装 Express 并将其保存到依赖列表中：
```bash
$ npm install express --save
```
如果只是临时安装 Express，不想将它添加到依赖列表中，只需略去 --save 参数即可：
```bash
$ npm install express
```

## express路由

路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。

路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成，它的结构如下： app.METHOD(path, [callback...], callback)， app 是 express 对象的一个实例， METHOD 是一个 HTTP 请求方法， path 是服务器上的路径， callback 是当路由匹配时要执行的函数。

下面是一个基本的路由示例：
```javascript
var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});
```
### 路由方法
路由方法源于 HTTP 请求方法，和 express 实例相关联。

下面这个例子展示了为应用跟路径定义的 GET 和 POST 请求：
```javascript
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});
```
`Express 定义了如下和 HTTP 请求对应的路由方法： get, post, put, head, delete, options, trace, copy, lock, mkcol, move, purge, propfind, proppatch, unlock, report, mkactivity, checkout, merge, m-search, notify, subscribe, unsubscribe, patch, search, 和 connect。`

`有些路由方法名不是合规的 JavaScript 变量名，此时使用括号记法，比如： app['m-search']('/', function ...`

app.all() 是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。

在下面的例子中，来自 “/secret” 的请求，不管使用 GET、POST、PUT、DELETE 或其他任何 http 模块支持的 HTTP 请求，句柄都会得到执行。

app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});
