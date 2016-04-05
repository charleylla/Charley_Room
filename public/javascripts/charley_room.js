$(function(){
	// 导入表情
	function addImgs(){
		var str = "";
		for(var i = 1;i<=50;i++){
			str += "<img class='emoj' src='/images/ALI/阿狸 ("+i+").gif' title='[emojs:"+i+"]'>";
		}
		$("#emojs").html(str);
	}
	addImgs();
	// 调用初始化方法
	function CharleyRoom(){
		this.socket = null;
		this.greetings = [
				"我就像一只趴在玻璃上的苍蝇，前途一片光明，而我却找不到出路。",
				"心中充满爱，看天下美女都是情人。",
				"台湾一日不收复，我一日不过4级！",
				"本人生性善良，平时就连踩死一只蚂蚁也会念经诵佛，超渡亡魂，并为其修坟造墓，更怕其死后单身寂寞，遂又踩死数十只蚂蚁为其做伴，可谓尽心尽力。",
				"好好活着，因为我们会死很久很久……",
				"如果你看到面前的阴影，别怕，那是因为你的背后有阳光。",
				"狂欢是一群人的孤单……",
				"上帝给了我们七情六欲，我们却把它们变成了色情和暴力。",
				"帅有个屁用！到头来还不是被卒吃掉！",
				"谁无虎落平阳日，待我东山再起时。",
				"谁能对偶的感情就像对人民币一样忠诚？",
				"流血了……会不会很疼？",
				"我爱你，并不是因为你是谁，而是在你面前时，我是谁！",
				"也因寂寞难耐，谈过几次恋爱。谁知屡战屡败，轻轻松松被踹！",
				"出问题先从自己身上找原因，别一便秘就怪地球没引力。",
				"21世纪，什么最重要——我！",
				"错过一个人最可怕的方式就是：坐在她的身旁，你却知道永远都不会拥有她。",
				"男人在不懂的时候装懂，女人则恰好相反。",
				"有钱男子汉，没钱汉子难！",
				"永远都不要停止微笑，即使是在你难过的时候，说不定有人会因为你的笑容而爱上你。",
				"大学这四年里，我一直认为自己是个人才，可是我错了，我不是！我tmd竟然是一个天才！",
				"我故意学习，故意工作，故意生活，故意活得像个人！",
				"一定是我的帅害死了我！",
				"生是她的人，死是她的吉祥物。",
				"如果个性是一种错，那麽我已壹错在错。如果帅是一种罪过，那麽我已罪恶滔天。如果聪明要受惩罚，那我岂不是该千刀万寡如果谦虚要受责駡，我怎能逃过妒忌的嘴巴。",
				"我喝酒是想把痛苦溺死，但这该死的痛苦却学会了游泳。",
				"堕落并不可怕，可怕的是当一个人堕落时非常清醒！",
				"你看得见我打在屏幕上的字，却看不到我掉在键盘上的泪……",
				"我们产生一点小分歧：她希望我把粪土变黄金，我希望她视黄金如粪土。",
				"千万别等到人人都说你丑时才发现自己真的丑。",
				"问君能有几多愁，恰似一群太监上青楼……",
				"完了，你也不理我了，我成狗不理了~~！",
				"我那么喜欢你，你喜欢我一下会死啊。",
				"我多想一个不小心就和你白头偕老",
				"我又不是人民币，怎么能让人人都喜欢我？",
				"如果你注定不能给予我期待的回应.那么就保持在安全距离之外吧",
				"诸葛亮出山前也没带过兵啊，你们凭啥要我有工作经验",
				"老娘法眼一开就知道你是个妖孽了",
				"爱情像鬼，相信的人多，遇见的人少",
				"我是你转身就忘的路人甲，凭什么陪你蹉跎年华到天涯？"
			];
	}
	// new CharleyRoom().init();
	CharleyRoom.prototype = {
		init:function(){
			// 这是一个坑
			var that = this;
			var me = $("#CURRENT_USER").val();
			// 建立到服务器的socket链接
			this.socket = io.connect();
			// 监听socket的connect事件
			this.socket.on("connect",function(){
				that.socket.emit("login",me);
			});
			this.socket.on("loginOut",function(userName,USERS){
				// 解决在服务器断开连接后提示 null一退出的bug
				if(userName){
					// 统计在线人数
					var count = 0;
					var $_houseRemind = "<p id='user_attend_in_out' class='center-block text-danger'><span id='userName'> "+userName+"   </span>已退出</p>"
					$("#chatHouse").append($_houseRemind);
					// 先清空chatList中的内容 以做到同步
					$("#chatList").html("");
					for(var user in USERS){
						var $_listRemind = "<li class='list-group-item'>"+USERS[user]+"</li>";
						$("#chatList").append($_listRemind);
						count ++;
					}
					$("#user_count").html(count);
					// 让滚动条始终处于底部
					$("#chatHouse").animate({scrollTop:$("#chatHouse").get(0).scrollHeight},500);
				}

			});
			// 登录成功后所有房间更新
			this.socket.on("system",function(userName,USERS){
				var count = 0;
				var $_houseRemind = "<p id='user_attend_in_out' class='center-block text-info'><span id='userName'> "+userName+"   </span>已加入聊天</p>";
				$("#chatHouse").append($_houseRemind);
				// 让滚动条始终处在底部
				$("#chatHouse").animate({scrollTop:$("#chatHouse").get(0).scrollHeight},500);
				// 先清空chatList中的内容 以做到同步
				$("#chatList").html("");
				for(var user in USERS){
					var $_listRemind = "<li class='list-group-item'>"+USERS[user]+"</li>";
					$("#chatList").append($_listRemind);
					count ++;
				}
				$("#user_count").html(count);
			});
			this.socket.on("startTextChat",function(broadCaster,data){
				// 发出信息得到相应后清楚输入框的内容
				$("#msg").val("");
				if(broadCaster == me){
					var $_houseRemind = "<div class='msg_container right'><span class='user'>"+me+"</span><div></div><div class='msg bg-success'>"+data+"</div></div><div style='clear:both'></div>"
				}else{
					var $_houseRemind = "<div class='msg_container'><span class='user'>"+broadCaster+"</span><div></div><div class='msg bg-danger'>"+data+"</div></div>"
				}
				$("#chatHouse").append($_houseRemind);
				// 始终让滚动条处于底部
				// $("#chatHouse").get(0).scrollTop = $("#chatHouse").get(0).scrollHeight;
				$("#chatHouse").animate({scrollTop:$("#chatHouse").get(0).scrollHeight},500);
			});
			// 发送消息
			$("#sendMsg").submit(function(){
				// 不能发送空信息
				// 在遮罩页面获取到焦点后不能发送消息
				if($("#msg").val()&&me){
					// 正则表达式用来判断表情的发送
					var reg = /\[emojs:\d+\]/g;
					var emojNum;
					var msgNew = "";
					var msg = "";
					// 将匹配到的结果赋值给matcher
					// macher是正则满足正则表达式匹配结果的数组集合
					var matcher = reg.exec($("#msg").val());
					// 如果matcher存在的话，执行发送表情的操作，否则，不进行转换
					if(matcher){
						for(var i = 0;i<matcher.length;i++){
							// 对匹配结果中的每一个元素进行拆分，只要数字部分
							emojNum = matcher[i].slice(7,-1);
							// 生成图片标签
							var emoj = "<img src='/images/ALI/阿狸 ("+emojNum+").gif' title='阿狸表情包_"+emojNum+"'>";
							msgNew = $("#msg").val().replace(reg,emoj);
						}
						// 替换原来的字符串
						msg = msgNew;
					}else{
						msg = $("#msg").val();
					}
					that.socket.emit("onTextChat",me,msg);
					return false;
				}
				return false;
			});
			// 点击document控制表情的显示和隐藏
			$(document).click(function(e){
				var tar = e.target.className;
				if(tar == "btn btn-default send_emojs"){
					if($("#emojs")[0].style.display == "none"){
						$("#emojs").show();
					}else{
						$("#emojs").hide();
					}
				}else if(tar == "emoj" || tar == "center-block emojs"){
					$("#emojs").show();
				}else{
					$("#emojs").hide();
				}
			});
			// 点击表情时控制
			$("#emojs .emoj").click(function(){
				var emojMsg = $(this).attr("title");
				var inputMsg = $("#msg").val();
				inputMsg += emojMsg;
				$("#msg").val(inputMsg);
			});	
			// 注销当前账号
			$("#loginOut").click(function(){
				that.socket.emit("someone_leave");
				$.ajax({
					url:"/loginOut",
					type:"get",
				});
				location.href="/loginOut";
			});
			// 关闭窗口
			$(window).unload(function(){
				that.socket.emit("someone_leave");
				// location.href="/loginOut";
			});
			// 窗口抖动
			this.socket.on("shake",function(){
				$(".outer").addClass("shake shake-horizontal");
				var shakeTimer = setTimeout(function(){
					$(".outer").removeClass("shake shake-horizontal");
				},500);
			});
			// 侧边栏的清屏 抖动 问候语功能
			$("#clean").click(function(){
				// 只影响当前的窗口
				$("#chatHouse").html("");
			});
			$("#shake").click(function(){
				that.socket.emit("letsShake");
			});
			$("#greeting").click(function(){
				$("#msg").val("");
				var greeting = that.greetings[Math.round(Math.random()*that.greetings.length)];
				$("#msg").val(greeting);
			});

		}
	};
	CharleyRoom.prototype.constructor = CharleyRoom;
	var charley = new CharleyRoom();
	charley.init();
});