var page = 1;
var size = 10;
var self;
mui.plusReady(function(){
//	vm = new Vue({
//		el:'#app',
//		data:{
//			List:[]
//		}, 
//		methods:{
//			newsClick:function(e){
//				alert(e);
//			}
//		},
//		mounted:function(){
//			fns.pullTo();//加载上拉刷新下拉加载
//			
//		}
//	})

})
setTimeout(function(){
		vm = new Vue({
		el:'#app',
		data:{
			List:[]
		}, 
		methods:{
			newsClick:function(e){
				alert(e);
			}
		},
		mounted:function(){
			fns.pullTo();//加载上拉刷新下拉加载
			
		}
	})
},500)

!function (fn){
	
	fn.pullTo = function(){
		mui("#refreshContainer .mui-scroll").pullToRefresh({
			down: { 
				callback: function() { 
					self = this;
					page = 1;
					fn.getList(function(e){
						setTimeout(function(){
							if(e.code == 1){
								page++
								vm.$data.List = [];
								vm.$data.List = vm.$data.List.concat(e.data)
							}
							self.endPullDownToRefresh();
							self.refresh(true);//重置上拉
							
						},500)
					});
				}
			},
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
			url : API.url1+'api/Article/getNewsList',
			page:page,
			size:size
		}
		common.get(data,Callback)
	}
	
	
}(window.fns ? window.fns : window.fns = {})
