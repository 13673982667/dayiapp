var loginInfo;
var selType = 'C2C';//设置私聊类型
var selToID;//当前聊天对象信息
var selSess = null; //当前聊天会话对象
var friendHeadUrl = '../img/touxiang.png'; //默认头像
var infoMap = {}; //初始化时，可以先拉取我的好友和我的群组信息
var getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息
var totalCount = 0;//每次接口请求的条数，bootstrap table 分页时用到
var userArr = []; //所有的用户信息

var vm = new Vue({
	el:'#app',
	data:{
		UserInfo:{},//用户登陆信息
		Emotions:webim.Emotions,//表情对象
		AllFriend:{},//好友列表
		defaultHeadUrl:'../img/touxiang.png',//默认头像
	},
	methods:{ 
		isShowClick:function(e){
			vm.$data.AllFriend[e].isShow = !vm.$data.AllFriend[e].isShow;
			if(vm.$data.AllFriend[e].isShow){
				selToID = e //设置聊天人为当前点击的 
				selSess = vm.$data.AllFriend[selToID].selSess
				vm.$data.AllFriend[selToID].isTishi = false;
			}else{
				selToID = null   
			}
		}, 
		sendMessage:function(e){//发送
			//先获取内容
			var dom = $('#'+e).find('.message')
			var content = dom.text();
			onSendMsg(content)
			dom.html('').focus();
		},
//		crtTimeFtt:common.crtTimeFtt
		showEmojiClick:function(e){//表情框显示隐藏
			document.activeElement.blur(); 
			this.$data.AllFriend[e].showEmoji = !this.$data.AllFriend[e].showEmoji
//			//如果是显示表情  就取消输入框的光标
			if(this.$data.showEmoji){
				$('#'+e).find('.message').attr('contenteditable',false);
//				document.activeElement.blur();   
			}
		},
		selEmojiClick:function(e,k){//选择表情
			this.$data.AllFriend[k].showEmoji = false;
//			var img = $('<img>').attr('src',e)
			$('#'+k).find('.message').append(e)
		},
		showContentClick:function(k){
//			$('#'+k).find('.message').html('asdad');
			$('#'+k).find('.message').attr('contenteditable',true);
			console.log($('#'+k).find('.message').attr('contenteditable'))
		},
		getlishi:function(k){//获取历史消息
			//拉去历史信息
			webIm.getLastC2CHistoryMsgs(function(e){ 
				vm.$data.AllFriend[k].islishiShow = false;//获取一次后隐藏按钮
				for(k in e){
            		addMsg(e[k]);
            	}
			},function(e){
				//拉取失败
				mui.toast('拉取失败'+e)
			});
		}
		
	},
	mounted:function(){
		loginIm()
	},
	updated:function(e){//当数据发生改变 渲染之后
		if(selToID){
			$('#'+selToID).find('.msg_list').scrollTop($('#'+selToID).find('.msg_list')[0].scrollHeight);
		}
   },
})
//$('#Message').on('tap',function(){ 
//	$(this).attr('contenteditable',true);
//})
//登陆im
 function loginIm (){
 	//获取登陆信息
		var data = {
			url:API.url1+'api/Im/userLoginInfo',
			uid:14
		} 
		common.get(data,function(e){
//			console.log(JSON.stringify(e));
			if(e.code == 1){
				
				loginInfo = {
					sdkAppID:IMCONF.sdkAppID,//用户标识接入 SDK 的应用 ID，必填
					appIDAt3rd:IMCONF.appIDAt3rd,//App 用户使用 OAuth 授权体系分配的 Appid，必填
					identifier:e.data.im_identifier,//用户帐号，必填
					identifierNick:e.data.nickname,//用户昵称，选填
					userSig:e.data.Sig,//鉴权 Token，identifier 不为空时，必填
					accountType:1,
					headurl:e.data.pic
				}
				vm.$data.UserInfo = e.data;
//				console.log(JSON.stringify(vm.$data.UserInfo));
				//登陆im
				webIm.login(loginInfo) 
			} 
		})
 }

//登陆成功
function cbOk(resp) {
	//隐藏加载框
	$(".loading").fadeOut(300,function(){
		$(".loading").remove()
	})
	vm.loginOk = true; 
	//获取好友列表
	webIm.getAllFriend(function(e){
		for(k in e){
			//每个好友创建一个对象
			Vue.set(vm.$data.AllFriend,e[k].Info_Account,createFriendObj(e[k].Info_Account))
		}
	});
}
//创建一个Vue好友对象
function createFriendObj(Info_Account){
	var data = {};
	data = {
		Info_Account:Info_Account //账号
	};
	data.isShow = false;  //聊天框
	data.islishiShow = true; //获取历史消息
	data.msg = [];  //消息
	data.showEmoji = false; //表情
	data.isTishi = false; //提示新消息小圆点
	//聊天对象
	data.selSess = new webim.Session(selType, Info_Account, Info_Account, getUserInfo(Info_Account) || friendHeadUrl, Math.round(new Date().getTime() / 1000));
	return data;
}

//登陆失败
function cbErr(err) {
    alert(err.ErrorInfo);
}

//输入框得到光标就隐藏表情框
$('.message').focus(function(e){
	vm.$data.showEmoji = false; 
}) 

//将退条消息push到data数组里
function pushMsg(msg){ 
//	console.log(JSON.stringify(msg));
	var tuId = selToID ? selToID : msg.fromAccountNick;
	if(!vm.$data.AllFriend[tuId]){//没有这个人的话新增个
		Vue.set(vm.$data.AllFriend,tuId,createFriendObj(tuId))
		//添加这个人为好友
		var data = {
			url:API.url1+'api/Im/addIdentifier',
			identifier:vm.$data.UserInfo.im_identifier,
			Toidentifier:tuId,
		}
		common.get(data,function(e){
			mui.toast('您有一条新好友的信息');
		})
	}
	vm.$data.AllFriend[tuId].msg.push(msg)
	if(!vm.$data.AllFriend[tuId].isShow){
		vm.$data.AllFriend[tuId].isTishi = true;
	}
	
//	if(!selToID){
//		if(!vm.$data.AllFriend[msg.fromAccountNick]){//没有这个人的话新增个
//			Vue.set(vm.$data.AllFriend,msg.fromAccountNick,createFriendObj(msg.fromAccountNick))
//			//添加这个人为好友
//			var data = {
//				url:API.url1+'api/Im/addIdentifier',
//				identifier:vm.$data.UserInfo.im_identifier,
//				Toidentifier:msg.fromAccountNick,
//			}
//			common.get(data,function(e){
//				mui.toast('您有一条新好友的信息');
//			})
//		}
////		console.log(JSON.stringify(vm.$data.AllFriend[msg.fromAccountNick]));
//		vm.$data.AllFriend[msg.fromAccountNick].msg.push(msg)
//	}else if(vm.$data.AllFriend[selToID]){
//		vm.$data.AllFriend[selToID].msg.push(msg)
//	}
} 
//更细所有这个客服下的用户信息
updateUserArr()
function updateUserArr(){
	var data = {
		url : API.url1+'api/Kefu/updateUserArr',
		kf_id : uId
	} 
	common.get(data,function(e){
		if(e.code == 1){
			userArr = e.data;
		}
	}); 
}
//给im账号 返回用户信息
function getUserInfo($im){
	return userArr[$im] ? userArr[$im] : false;
}
