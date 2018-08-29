//监听事件
var listeners = {
    "onConnNotify": onConnNotify//监听连接状态回调变化事件,必填
    ,"jsonpCallback": jsonpCallback//IE9(含)以下浏览器用到的 jsonp 回调函数，
    ,"onMsgNotify": onMsgNotify//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
//  ,"onBigGroupMsgNotify": onBigGroupMsgNotify//监听新消息(直播聊天室)事件，直播场景下必填
//  ,"onGroupSystemNotifys": onGroupSystemNotifys//监听（多终端同步）群系统消息事件，如果不需要监听，可不填
//  ,"onGroupInfoChangeNotify": onGroupInfoChangeNotify//监听群资料变化事件，选填
    ,"onFriendSystemNotifys": onFriendSystemNotifys//监听好友系统通知事件，选填
//  ,"onProfileSystemNotifys": onProfileSystemNotifys//监听资料系统（自己或好友）通知事件，选填
    ,"onKickedEventCall" : onKickedEventCall//被其他登录实例踢下线
    ,"onC2cEventNotifys": onC2cEventNotifys//监听 C2C 系统消息通道
};




//监听连接状态回调变化事件
var onConnNotify = function (resp) {
    var info;
    switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
            webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
            break;
        case webim.CONNECTION_STATUS.OFF:
            info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
            alert(info);
            webim.Log.warn(info);
            break;
        case webim.CONNECTION_STATUS.RECONNECT:
            info = '连接状态恢复正常: ' + resp.ErrorInfo;
            alert(info);
            webim.Log.warn(info);
            break;
        default:
            webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
            break;
    }
};
 
//IE9(含)以下浏览器用到的 jsonp 回调函数
function jsonpCallback(rspData) {
//设置 jsonp 返回的
    webim.setJsonpLastRspData(rspData);
}

//监听新消息事件
//newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify(newMsgList) {
	console.warn('收到消息');
//    console.warn(newMsgList);
    var sess, newMsg;
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();
    for (var j in newMsgList) {//遍历新消息
        newMsg = newMsgList[j];
//      console.log(JSON.stringify(newMsg));
        addMsg(newMsg);
        if (newMsg.getSession().id() == selToID) {//为当前聊天对象的消息
        	//如果发送消息的是当前正在聊天的
        	//消息已读上报，以及设置会话自动已读标记
    		webim.setAutoRead(selSess, true, true); 
            selSess = newMsg.getSession();
            //在聊天窗体中新增一条消息
//            console.warn(newMsg);
        } 
    } 
    for (var i in sessMap) {
        sess = sessMap[i];
        if (selToID != sess.id()) {//更新其他聊天对象的未读消息数
			console.log('未读-'+sess.id()+'---'+sess.unread());
//          updateSessDiv(sess.type(), sess.id(), sess.unread());
        }
    }
}

//监听（多终端同步）群系统消息方法，方法都定义在 receive_group_system_msg.js 文件中
//注意每个数字代表的含义，比如，
//1 表示监听申请加群消息，2 表示监听申请加群被同意消息，3 表示监听申请加群被拒绝消息
//var groupSystemNotifys = {
//  "1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到）
//  "2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到）
//  "3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到）
//  "4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到)
//  "5": onDestoryGroupNotify, //群被解散(全员接收)
//  "6": onCreateGroupNotify, //创建群(创建者接收)
//  "7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收)
//  "8": onQuitGroupNotify, //主动退群(主动退出者接收)
//  "9": onSetedGroupAdminNotify, //设置管理员(被设置者接收)
//  "10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收)
//  "11": onRevokeGroupNotify, //群已被回收(全员接收)
//  "255": onCustomGroupNotify//用户自定义通知(默认全员接收)
//};

//监听好友系统通知函数对象，方法都定义在 receive_friend_system_msg.js 文件中
var onFriendSystemNotifys = { 
//  "1": onFriendAddNotify, //好友表增加
//  "2": onFriendDeleteNotify, //好友表删除
//  "3": onPendencyAddNotify, //未决增加
//  "4": onPendencyDeleteNotify, //未决删除
//  "5": onBlackListAddNotify, //黑名单增加
//  "6": onBlackListDeleteNotify//黑名单删除
};

//监听资料系统通知函数对象，方法都定义在 receive_profile_system_msg.js 文件中
//var onProfileSystemNotifys = {
//  "1": onProfileModifyNotify//资料修改
//};

//监听 C2C 消息通道的处理，方法在 receive_new_msg.js 文件中
var onC2cEventNotifys = {
    "92": onMsgReadedNotify,//消息已读通知
};

//监听 群资料变化 群提示消息
function onGroupInfoChangeNotify(groupInfo) {
    webim.Log.warn("执行 群资料变化 回调： " + JSON.stringify(groupInfo));
    var groupId = groupInfo.GroupId;
    var newFaceUrl = groupInfo.GroupFaceUrl;//新群组图标, 为空，则表示没有变化
    var newName = groupInfo.GroupName;//新群名称, 为空，则表示没有变化
    var newOwner = groupInfo.OwnerAccount;//新的群主 id, 为空，则表示没有变化
    var newNotification = groupInfo.GroupNotification;//新的群公告, 为空，则表示没有变化
    var newIntroduction = groupInfo.GroupIntroduction;//新的群简介, 为空，则表示没有变化
    if (newName) {
        //更新群组列表的群名称
        //To do
        webim.Log.warn("群id=" + groupId + "的新名称为：" + newName);
    }
}
//被其他登录实例踢下线
function onKickedEventCall(e){
	alert('被其他登录实例踢下线');
}

