var loginInfo;
var selType = 'C2C';//设置私聊类型
var selToID;//当前聊天对象信息
var friendHeadUrl; //默认头像
var infoMap = {}; //初始化时，可以先拉取我的好友和我的群组信息
var getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息
var selSess = null; //当前聊天会话对象
var userArr = []; //所有的用户信息
 
var vm = new Vue({
	el:'#app',
	data:{
		loginOk:true, //是否登陆
		UserInfo:{},//用户登陆信息
		kfInfo:{},
		msgArr:[], //消息列表
		showEmoji:false,//表情显示
		Emotions:webim.Emotions,//表情对象
	},
	methods:{
		sendMessage:onSendMsg,
//		crtTimeFtt:common.crtTimeFtt
		showEmojiClick:function(){//表情框显示隐藏
			document.activeElement.blur(); 
			this.$data.showEmoji = !this.$data.showEmoji
//			//如果是显示表情  就取消输入框的光标
			if(this.$data.showEmoji){
				$('#Message').attr('contenteditable',false);
//				document.activeElement.blur();   
			}
		},
		selEmojiClick:function(e){//选择表情
			this.$data.showEmoji = false;
//			var img = $('<img>').attr('src',e)
			$('#Message').append(e)
			
		} 
	},
	mounted:function(){
		
		loginIm()
		mui('#refreshContainer').pullRefresh()
	},
	updated:function(e){//当数据发生改变 渲染之后
        $('#msg_list').scrollTop($('#msg_list')[0].scrollHeight);
    },
})
$('#Message').on('tap',function(){
	$(this).attr('contenteditable',true);
})
//登陆im
 function loginIm (){
 	//获取登陆信息
		var data = {
			url:API.url1+'api/Im/userLoginInfo',
			uid:uId
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

	vm.loginOk = true; 
	//添加客服
	getKf();
}

//登陆失败
function cbErr(err) {
    alert(err.ErrorInfo);
}

//获取客服 添加好友
function getKf(){
	//获取一个空闲的客服
	var data = {
		url:API.url1+'api/Im/getKfIdentifier',
	} 
	common.get(data,function(e){
		if(e.code == 1){
			vm.$data.kfInfo = e.data
			selToID = vm.$data.kfInfo.im_identifier;
			selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
			addKf();
		}
	})
}

//添加客服
function addKf(){
//	console.log(JSON.stringify(vm.$data.kfInfo));
//		console.log(JSON.stringify(vm.$data.UserInfo)); 
	//添加好友
	var data = {
		url:API.url1+'api/Im/addIdentifier',
		identifier:vm.$data.UserInfo.im_identifier,
		Toidentifier:vm.$data.kfInfo.im_identifier,
	}
//	alert(JSON.stringify(vm.$data.kfInfo));
	common.get(data,function(e){
		if(e.code == 1){
			//隐藏加载框
			$(".loading").fadeOut(300,function(){
				$(".loading").remove()
			})
			//拉去历史信息
			webIm.getLastC2CHistoryMsgs(function(e){ 
//				console.log(e);
				for(k in e){
            		addMsg(e[k]);
            	}
				setTimeout(function(){
						$('#msg_list').scrollTop($('#msg_list')[0].scrollHeight);
				},1000)
				
			},function(e){
				//拉取失败
				console.log('拉取失败'+e)
			});
		}
	})
}
//输入框得到光标就隐藏表情框
$('#Message').focus(function(e){
	vm.$data.showEmoji = false; 
}) 


//将退条消息push到data数组里
function pushMsg(msg){ 
	vm.$data.msgArr.push(msg)    
//	console.log($('#msg_list').scrollTop()+'---'+$('#msg_list')[0].scrollHeight);
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
