$(function(){
	$("#loginIn").click(function(){
		$("#login").modal("hide")
	})
	// 阻止默认的提交
	$("form").submit(function(){
		return false;
	})
	$("#reg_btn").click(function(){
		var username = $("#reg_username").val();
		var p1 = $("#reg_password").val();
		var p2 = $("#confirm_password").val();
		var warn = $("#reg_alert");
		if(p1!==p2){
			$("#pass_1").addClass("has-error");
			$("#pass_2").addClass("has-error");
			warn.html("两次输入的密码不一致！").show();
		}else{
			$("#pass_1").removeClass("has-error");
			$("#pass_2").removeClass("has-error");
			warn.hide();

			// 准备表单提交
			// operate是标志属性，告诉index.js我们是在登录还是注册
			var data = {"username":username+"","password":p1+"","operate":"reg"};
			// 使用ajax将数据提交到index.js进行处理
			$.ajax({
				url:"/",
				type:"post",
				data:data,
				success:function(){
					warn.html("注册成功！<a href='javascript:;' data-dismiss='modal' data-toggle='modal' data-target='#login' style='margin-left:10px'>现在登录</a>").show();
				},
				error:function(){
					warn.html("用户名已存在！").show();
				}
			});
		}
	});

	$("#login_btn").click(function(){
		var username = $("#login_username").val();
		var p1 = $("#login_password").val();
		var data = {"username":username+"","password":p1+"","operate":"login"};
		var warn = $("#login_alert");
		// 使用ajax将数据提交到index.js进行处理
		$.ajax({
			url:"/",
			type:"post",
			// data:data,
			data:data,			
			success: function(){ 
				// alert(session.user)
				location.href = "chatroom";
				// alert(data)
				warn.html("登录成功！").show();
			},
			error: function(data,err){ 
				warn.html("用户名或密码错误！").show();
			}
		});
	});
})