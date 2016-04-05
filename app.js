var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var USERS = {};

app.use(session({ 
    secret: 'Charley',
    cookie:{ 
        maxAge: 1000*60*30
    }
}));

// 通信
io.sockets.on("connection",function(socket){
  var nickName = "";
  socket.on("login",function(nickName){
    nickName = nickName;
    USERS[nickName] = nickName;
    socket.userIndex = nickName;
    socket.emit("loginSuccess",nickName);
    io.sockets.emit("system",nickName,USERS);
  });
  socket.on("someone_leave",function(){
    delete USERS[socket.userIndex];
    socket.broadcast.emit("loginOut",socket.userIndex,USERS);
  });
  socket.on("onTextChat",function(user,msg){
    io.sockets.emit("startTextChat",user,msg);
  });
  socket.on("letsShake",function(){
    io.sockets.emit("shake");
  });
});


global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/charley_room_db");

// 添加路由
var routes = require("./routes/index");
var users = require('./routes/users');

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser());



app.use(function(req,res,next){ 
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = "";
  if(err){
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();
});

// 使用路由
app.use("/", routes);
// 使用 "/" 访问调用routes下的index文件（默认）
app.use("/chatroom",routes);
app.use("/unLogin",routes);
// app.use("/chatroom",routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

// 监听8888端口
server.listen(8888,function(){
  console.log(">>Charley_Room正在监听8888端口");
});

module.exports = app;
