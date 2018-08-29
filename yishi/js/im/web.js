!function(im){
	//登陆
	im.login = function(loginInfo,suc){
		var options = {
			isAccessFormalEnv:true,//True-访问正式环境
			isLogOn:false//是否开启控制台打印日志，True-开启，False-关闭
		}
		//登陆
		webim.login(
            loginInfo, listeners, options,
            cbOk,cbErr
    	);
	}
	//获取最新的 C2C 历史消息,用于切换好友聊天，重新拉取好友的聊天消息
	im.getLastC2CHistoryMsgs = function (cbOk, cbError) {
	    if (selType == webim.SESSION_TYPE.GROUP) {
	        alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
	        return;
	    }
	    var reqMsgCount = 10//拉取消息条数
	    var lastMsgTime = 0;//第一次拉取好友历史消息时，必须传 0
	    var msgKey = '';
	    var options = {
	        'Peer_Account': selToID, //好友帐号
	        'MaxCnt': reqMsgCount, //拉取消息条数
	        'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
	        'MsgKey': msgKey
	    };
	    webim.getC2CHistoryMsgs(
            options,
            function (resp) {
                var complete = resp.Complete;//是否还有历史消息可以拉取，1-表示没有，0-表示有
                var retMsgCount = resp.MsgCount;//返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
                if (resp.MsgList.length == 0) {
                    webim.Log.error("没有历史消息了:data=" + JSON.stringify(options));
                    return;
                }
                getPrePageC2CHistroyMsgInfoMap[selToID] = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
                    'LastMsgTime': resp.LastMsgTime,
                    'MsgKey': resp.MsgKey 
                };
                if (cbOk){
                	cbOk(resp.MsgList);
                }
            },
            cbError
            );
	};
	//拉取好友列表
	im.getAllFriend = function (cbOK, cbErr) {
		
	    var options = {
	        'From_Account': loginInfo.identifier,
	        'TimeStamp': 0,
	        'StartIndex': 0,
	        'GetCount': totalCount,
	        'LastStandardSequence': 0,
	        "TagList":
	                [
	                    "Tag_Profile_IM_Nick",
	                    "Tag_SNS_IM_Remark"
	                ]
	    };
	    webim.getAllFriend(
	            options,
	            function (resp) {
	                //清空聊天对象列表
//	                var sessList = document.getElementsByClassName("sesslist")[0];
//	                sessList.innerHTML = "";
//					console.log('-'+JSON.stringify(resp));

	                if (resp.FriendNum > 0) { 
	                    var friends = resp.InfoItem;
	                    if (!friends || friends.length == 0) {
	                        return;
	                    }
	                    
	                    var count = friends.length;
	                    for (var i = 0; i < count; i++) {
	                        var friend_name = friends[i].Info_Account;
	                        if (friends[i].SnsProfileItem && friends[i].SnsProfileItem[0] 
	                            && friends[i].SnsProfileItem[0].Tag) {
	                            friend_name = friends[i].SnsProfileItem[0].Value;
	                        }
	                        if (friend_name.length > 7) {//帐号或昵称过长，截取一部分
	                            friend_name = friend_name.substr(0, 7) + "...";
	                        }
	                        //增加一个好友div
//	                        addSess(friends[i].Info_Account, webim.Tool.formatText2Html(
//	                        friend_name), 
//	                        friendHeadUrl, 0, 'sesslist');
	                    }
//	                    if (selType == SessionType.C2C) {
//	                        //清空聊天界面
//	                        document.getElementsByClassName("msgflow")[0].innerHTML = "";
//	                        //默认选中当前聊天对象
//	                        selToID = friends[0].Info_Account;
//	                        //设置当前选中用户的样式为选中样式
//	                        var selSessDiv = $("#sessDiv_" + selToID)[0];
//	                        selSessDiv.className = "sessinfo-sel";
//	                        var selBadgeDiv = $("#badgeDiv_" + selToID)[0];
//	                        selBadgeDiv.style.display = "none";
//	                    }

	                    if (cbOK)
	                    
	                        cbOK(resp.InfoItem);
	               }
	            },
	            function (err) {
	                alert(err.ErrorInfo); 
	            }
	    );
	};
	
	
}(window.webIm ? window.webIm : window.webIm = {})



//发送消息(文本或者表情)
function onSendMsg(content) {
//	friendHeadUrl = vm.$data.kfInfo.pic;//好友头像
    if (!selToID) {
        alert("你还没有选中好友或者群组，暂不能聊天");
//      $("#send_msg_text").val('');
        return;
    } 
    //获取消息内容
    var msgtosend = content;
//  $('#Message').html('').focus();  
    var msgLen = webim.Tool.getStrBytes(msgtosend);
    if (msgtosend.length < 1) {
    	
//      $("#send_msg_text").val('');
        return; 
    }
    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.C2C) {//私聊
        maxLen = webim.MSG_MAX_LENGTH.C2C;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {//群聊
        maxLen = webim.MSG_MAX_LENGTH.GROUP;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
        alert(errInfo);
        return;
    }
    if (!selSess) {
      var  selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true;//是否为自己发送
    var seq = -1;//消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
    var subType;//消息子类型
    if (selType == webim.SESSION_TYPE.C2C) {
        subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    } else {
        //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
        //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
        //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
        //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    }
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);   
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    if (!emotions || emotions.length < 1) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
    } else {
        for (var i = 0; i < emotions.length; i++) {
            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
            if (tmsg) {
                text_obj = new webim.Msg.Elem.Text(tmsg);
                msg.addText(text_obj);
            }
            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
            emotion = webim.Emotions[emotionIndex];
            if (emotion) {
                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                msg.addFace(face_obj);
            } else {
                text_obj = new webim.Msg.Elem.Text(emotions[i]);
                msg.addText(text_obj);
            }
            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
            msgtosend = msgtosend.substring(restMsgIndex);
        }
        if (msgtosend) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        }
    }

    webim.sendMsg(msg, function (resp) {
    	//发送成功
        if (selType == webim.SESSION_TYPE.C2C) {//私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            addMsg(msg);
        }
//      webim.Tool.setCookie("tmpmsg_" + selToID, '', 0);
//      $("#send_msg_text").val('');
//      turnoffFaces_box();
    }, function (err) {
        alert(err.ErrorInfo);
        $("#send_msg_text").val('');
    });
}


