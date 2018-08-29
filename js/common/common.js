const  API = {
//	url:'http://www.63218860.com/',
//	url:'http://192.168.0.110/',//
//	url1:'http://192.168.0.110/api.php/'
	url:'http://www.wppzmw.top/',//
	url1:'http://www.wppzmw.top/api.php/'
}  
const IMCONF = {
	sdkAppID:'1400110826',
	appIDAt3rd:'1400110826'
}
var uId = localStorage.getItem('uId');
var uType = localStorage.getItem('uType');//用户类型
var $_GET = (function() {
	var url = window.document.location.href.toString();
	var u = url.split("?");
	if (typeof(u[1]) == "string") { 
		u = u[1].split("&");  
		var get = {};
		for (var i in u) {
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		return {};
	} 
})();

//阻止a标签跳转
mui('body').on('click','a',function(e){
	e.preventDefault();
	var href = $(this).attr('href') 
	if(href && href.length>1 && href.substring(0,1) !== '#'){
		mui.openWindow({
			url:href, 
			id:href
		})
	} 
});

!(function(com){

//	$('a').click(function(e){
//		
//	})
	com.get = function(data,fn,async){
		$.ajax({
			url:data.url ? data.url : API.url,
			type:'GET',
	    	data:data,
	    	dataType:'json',
	    	async:async ? false : true,
	    	success:function(e){
	    		fn(e);
	    	},
	    	error:function(e){
	    		fn(e);
	    	},
		})
	}
	com.post = function(data,fn){
		$.ajax({
			url:data.url ? data.url : API.url,
			type:'POST',
	    	data:data,
	    	dataType:'json',
	    	success:function(e){
	    		fn(e);
	    	},
	    	error:function(e){
	    		fn(e);
	    	},
		})
	}
	//使用等待框
	com.getp = function(data,fn){
		plus.nativeUI.showWaiting();  //显示等待框
		$.ajax({
			url:data.url ? data.url : API.url,
			type:'GET',
	    	data:data,
	    	dataType:'json',
	    	success:function(e){
	    		fn(e);
	    		plus.nativeUI.closeWaiting(); //关闭等待框
	    	},
	    	error:function(e){
	    		fn(e);
	    		plus.nativeUI.closeWaiting(); //关闭等待框
	    	},
		})
	}
	//使用等待框
	com.postp = function(data,fn){
		plus.nativeUI.showWaiting();  //显示等待框
		$.ajax({
			url:data.url ? data.url : API.url,
			type:'POST',
	    	data:data,
	    	dataType:'json',
	    	success:function(e){
	    		fn(e);
	    		plus.nativeUI.closeWaiting(); //关闭等待框
	    	},
	    	error:function(e){
	    		fn(e);
	    		plus.nativeUI.closeWaiting(); //关闭等待框
	    	},
		})
	}
	//打开的页面需要登陆的时候
	com.openWindow = function(obj){
		if(uId){
			mui.openWindow(obj)
		}
	}
	
	//时间格式化
	com.dateFtt = function(fmt,date)   
	{ //author: meizz   
	  var o = {   
	    "M+" : date.getMonth()+1,                 //月份   
	    "d+" : date.getDate(),                    //日   
	    "h+" : date.getHours(),                   //小时   
	    "m+" : date.getMinutes(),                 //分   
	    "s+" : date.getSeconds(),                 //秒   
	    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
	    "S"  : date.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;   
	}  
	com.crtTimeFtt = function(value,row,index){
	    var crtTime = new Date(value ? (value * 1000) : new Date()); 
	    if(!row){
	    	row = 'yyyy-MM-dd:hh:mm:ss'
	    }else if (row == 1){
	    	row = 'hh:mm:ss'
	    }
	    return com.dateFtt(row,crtTime);//直接调用公共JS里面的时间类处理的办法     
	}

	
}(window.common ? window.common : window.common = {}))

