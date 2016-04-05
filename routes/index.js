var express = require('express');
var router = express.Router();
// 引入加密的模块
var crypto = require('crypto');
/* GET home page. */
/* GET index page. */
router.get('/', function(req, res,next) {
  // res.render('index', {});    // 到达此路径则渲染index文件，并传出title值供 index.html使用
  res.render('index',{});
});

/* GET login page. */
router.post('/', function(req, res) {
  //get User info
  //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
  var operate = req.body.operate;
  if(operate === "login"){
    var User = global.dbHandel.getModel('user');  
    var username = req.body.username;
      User.findOne({name:username},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
      if(err){                    //错误就返回给原post处（login.html) 状态码为500的错误
        res.sendStatus(500);
        console.log(err);
      }else if(!doc){                 //查询不到用户名匹配信息，则用户名不存在
        res.sendStatus(404);              //  状态码返回404
      }else{ 
        if(req.body.password != doc.password){  //查询到匹配用户名的信息，但相应的password属性不匹配
          res.sendStatus(404);
        }else{                  
          //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
          req.session.user = doc;
          res.sendStatus(200);
        }
      }
  });
}else{
   //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({name: username},function(err,doc){ 
      if(err){ 
        res.sendStatus(500);
        console.log(err);
      }else if(doc){ 
        res.sendStatus(500);
      }else{ 
        User.create({               // 创建一组user对象置入model
          name: username,
          password: password
        },function(err,doc){ 
           if (err) {
              res.sendStatus(500);
              console.log(err);
            } else {
                res.sendStatus(200);
            }
          });
        }
    });
  }
});

router.get('/chatroom?', function(req,res,next) {
    if(req.session.user){
      res.render("chatroom",{user:req.session.user.name});
    }else{
      req.session.null = null;
      res.redirect("/unLogin");
    }
});

// 退出登陆后不允许再次进入聊天室 IS_LOGIN的值为false
router.get("/loginOut",function(req,res){
  req.session.null = null;
	res.render("loginOut");
});
router.get("/unLogin",function(req,res){
  res.render("unLogin");
});
module.exports = router;
