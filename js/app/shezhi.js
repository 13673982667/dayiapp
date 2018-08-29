var Intent = null,
    File = null,
    Uri = null,
    main = null;
var cacheCaleState=false;
var os=null;
var cacheDom
mui.plusReady(function() {
	
	version_();//版本
	cache_();//缓存
});
function cache_(){
	//缓存
	cacheDom = $('.clearCache');
     os=plus.os.name;
        if(os == "Android") {
            main = plus.android.runtimeMainActivity();
            Intent = plus.android.importClass("android.content.Intent");
            File = plus.android.importClass("java.io.File");
            Uri = plus.android.importClass("android.net.Uri");
        }
     initCacheSize();
	
  	$('.clearCache').on('tap', function() { 
        plus.nativeUI.confirm("确定清除缓存？ 清除后App中的数据将会被清理，用户需重新登录", function(e) {
            if(e.index == 0) {
                console.log("cacheCaleState:"+cacheCaleState);
                if(os=="Android"){
                    if(cacheCaleState==true){
                    clearAllCache4Android();    
                }else{
                    mui.toast("缓存计算中……");
                }
                }else if(os=="iOS"){ 
                    clearCache(function(){
                        //再次计算缓存大小
                        initCacheSize();
                    });
                }
                localStorage.clear()
                mui.toast('清除成功')
                setTimeout(function(){
                	openLogin();
                	setTimeout(function(){
	                	var page = plus.webview.getWebviewById('shezhi.html');  //获取这个页面
						if(page){//如果有的话关闭
							page.hide();
							page.close('none'); //关闭这个页面		
						}
                	},500)
                },500)
            }
        }, "新消息通知", ["确定", "取消"]);
    });
}
//以下是方法体 计算缓存大小
function initCacheSize (){
	cacheDom = $('.clearCache').find('p')[0]
    var formatedSize;
    if(os=="Android"){
        formatedSize=formatSize(calcCache4Android());
        cacheCaleState=true;
        cacheDom.innerHTML="<span class='mui-badge '>" + formatedSize + "</span>";
    }else if(os=="iOS"){
        calcCache(function(size) {
            cacheCaleState=true; 
        formatedSize=formatSize(size);
        cacheDom.innerHTML="<span class='mui-badge '>" + formatedSize + "</span>";
    });
    }else{
        mui.toast("未知的设备类型,无法计算缓存");
        cacheCaleState=false;
    }
//  $('.clearCache').find('p').html(formatedSize);
}
      /**
 * 计算缓存大小  官方提供方法，用于iOS
 */
function calcCache(callback) {
    console.log("开始计算缓存大小");
    var finalSize = -1;
    plus.cache.calculate(function(size) {
        console.log(size + "byte");
        var sizeInt = parseInt(size);
        console.log("sizeInt" + sizeInt);
        return callback(finalSize);
    });

}

function calcCache4Android() {
    var cacheSize=0;
//  console.log("start calc android");
        var sdRoot = main.getCacheDir();
        var files = plus.android.invoke(sdRoot,"listFiles");
         cacheSize += getFolderSize(files); 
//  console.log("android size-->"+cacheSize);
    return cacheSize;
}

    function getFolderSize(files) {
        var size = 0;
            var len = files.length;
            for(var i = 0; i < len; i++) {
                // 如果下面还有文件
                if(files[i].isDirectory()) {
                    size = size + getFolderSize(files[i]);
                } else if(!files[i].isHidden()){
                    size = size + files[i].length();
                }
            }
        return size;
}

function formatSize(size){
    var fileSizeString;
    size=parseInt(size);

    if(size == 0){
        fileSizeString = "0B";
    }else if(size < 1024){
        fileSizeString = size + "B";
    }else if(size < 1048576){
        fileSizeString = (size/1024).toFixed(2) + "KB";
    }else if (size < 1073741824){
        console.log("Mb"+size);
        fileSizeString = (size/1048576).toFixed(2) + "MB";
        console.log("/ after"+fileSizeString);
    }else{
        fileSizeString = (size/1073741824).toFixed(2) + "GB";
    }
    return fileSizeString;
}
        
//以下是删除缓存的方法
 /**
 * 清除缓存  
 */
function clearCache(callback) {
    plus.storage.clear();
    plus.cache.clear(function() {
        console.log("清除了~~~return");
        return callback();
    });
}
function clearAllCache4Android(){
    console.log("清理所有缓存");
     console.log("main"+main.getCacheDir());
        var sdRoot = main.getCacheDir();
        var files = plus.android.invoke(sdRoot,"listFiles");
            deleteDir(files);   
        //再次计算缓存大小
       initCacheSize();
}

function deleteDir(files){
    var len = files.length;
    console.log("len:"+len);
    for(var i = 0; i < len; i++) {
    	console.log("delete file dir:"+files[i]);
        files[i].delete();
    }
 }
var wgtVer = null;
var wgtUrl;
function version_(){
	// ......
    // 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
        wgtVer = inf.version;
//      console.log("当前应用版本：" + wgtVer);
		$('.ver').find('.str').html(wgtVer);
//      update_wgt();
    });
}

function update_wgt(){
    // 检测更新
    ca.get({
        url: xinwen.url+'/getversion',
        data: {
            act: 'app_version',
            ver: wgtVer
        },
        succFn: function(data) {
            var res = JSON.parse(data);
            if(data.wgtVer != res.data) {
                // 下载wgt文件
                wgtUrl = xinwen.url+'/xinwen.wgt';
                downWgt();
            }
        }
    });
}