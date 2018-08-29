
var page = 1;
var size = 10;
var self;
mui.plusReady(function(){
	vm = new Vue({
		el:'#app',
		data:{
			List:[]
		}, 
		methods:{
		},
		mounted:function(){
			fns.pullTo();//加载上拉刷新下拉加载
		}
	})

})
	

!function (fn){
	
	fn.pullTo = function(){
		mui("#refreshContainer .mui-scroll").pullToRefresh({
//			down: { 
//				callback: function() { 
//					self = this;
//					page = 1;
//					fn.getList(function(e){
//						setTimeout(function(){
//							if(e.code == 1){ 
//								page++
//								vm.$data.List = [];
//								vm.$data.List = vm.$data.List.concat(e.data)
//							}
//							self.endPullDownToRefresh();
//							self.refresh(true);//重置上拉
//							
//						},500)
//					});
//				}
//			},
			up: {//上拉
				callback: function() {
					self = this;
					fn.getList(function(e){
						if(e.code == 1){
							page++
							vm.$data.List = vm.$data.List.concat(e.data)
							self.endPullUpToRefresh();
//							console.log(JSON.stringify(vm.$data.List));
						}else{
							self.endPullUpToRefresh(true);
						}
					});
				},
				auto:true,//可选,默认false.自动上拉加载一次 
			}
		});
	}
	//列表
	fn.getList = function(Callback){
		var data = {
			url : API.url1+'api/Article/getVideoList',
			page:page,
			size:size
		}
		common.get(data,Callback)
	}
	
	//播放
	fn.play = function(e){
		var id = $(e).attr('vid')
		var li = $('#'+id);
		li.find('video').attr('controls',true)[0].play();
		li.find('.vd').hide();
		li.siblings('li').find('.vd').show();
		li.siblings('li').find('video')[0].pause();
		li.find('video')[0].onpause = fn.pause
	}
	//暂停
	fn.pause = function(){
		$(this).attr('controls',false);
		
        var scale = 0.8;
		var id = $(this).attr('vid')
		var li = $('#'+id); 
		li.find('.vd').show();
		var video = $(this)[0];

		
		
//		var canvas = document.createElement("canvas");
//      canvas.width = video.videoWidth * scale;
//      canvas.height = video.videoHeight * scale;
//      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
// 
////      var img = document.createElement("img");
//      var src = canvas.toDataURL("image/png");
//      li.find('img').attr('src',src);
	}
	
	
}(window.fns ? window.fns : window.fns = {})
 