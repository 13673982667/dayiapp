//var vm;
//mui.plusReady(function(){
//	vm = new Vue({
//		el:'#app',
//		data:{
//			List:{}
//		},
//		methods:{
//
//		},
//		mounted:function(){ 
//			fns.getList()
//		}
//	})
//})
//!function(fn){
//	//医师列表
//	fn.getList = function(){ 
//		var data = {
//			url:API.url1+'api/Dp/getYsList',
//			uId:13
//		}
//		common.get(data,function(e){
////			console.log(JSON.stringify(e)); 
//			if(e.code == 1){
//				vm.$data.List = e.data
//			}
//		})
//	}
//}(window.fns ? window.fns : window.fns = {})
var page = 1;
var size = 10;
var page1 = 1;
var size1 = 10;
//禁用按钮
Vue.component('jinyong',{
	props:[
		'k','name'
	],
	template:'<button type="button" :k="k" :name="name" class="mui-btn mui-btn-danger mui-btn-outlined jinyong" >禁用</button>'
})
//审核通过按钮
Vue.component('Tongguo',{
	props:[
		'k','name'
	],
	template:'<button type="button" :k="k" :name="name" class="mui-btn mui-btn-primary mui-btn-outlined tongguo" >审核通过</button>'
})
  
function item1(){
	item1 = new Vue({
		el:'#item1',
		data:{
			List:[] 
		},
		methods:{
			
		},
		mounted:function(){  
//			//获取列表
//			fns.getList();
			fns.pullTo1();
        },
		updated:function(){
//					mui('.mui-slider-group').scroll()
//					var slider = mui('.mui-slider').slider();
		}
	})
}
//预约历史
function item2(){
	item2 = new Vue({
		el:'#item2',
		data:{
			List:[] 
		},
		methods:{
			
		},
		mounted:function(){  
//					//获取列表
//			fns.getList();
			fns.pullTo2();
        },
		updated:function(){
//					mui('.mui-slider-group').scroll()
//					var slider = mui('.mui-slider').slider();
		}
	})
}
!function(fn){
	//获取我的预约列表  正在预约的
	fn.getList = function (Callback){ 
		var data = {
			url:API.url1+'api/Dp/getYsList',
			uId:uId,
			page:page1,
			size:size1
		}
		common.get(data,Callback)
	}
	//预约历史
	fn.getItem2List = function(Callback){
		var data = { 
			url:API.url1+'api/Dp/getYsListOut', 
			uId:uId,
			page:page,
			size:size
		}
		common.get(data,Callback)
	} 
	//修改医师状态
	fn.updateUserInfo = function(yId,status,Callback){
		var data = {
    		url:API.url1+'api/Users/updateUserInfo',
    		uId:yId,
    		status:status
    	}
		common.postp(data,Callback)  
	}
	fn.pullTo1 = function(){
		mui("#scroll1 .mui-scroll").pullToRefresh({ 
			down: {  
				callback: function() { 
					self1 = this;
					page1 = 1;

					fn.getList(function(e){ 
//						console.log(JSON.stringify(e));
						setTimeout(function(){
							if(e.code == 1){
								page1++
								item1.$data.List = [];
								item1.$data.List = item1.$data.List.concat(e.data)
							}
							self1.endPullDownToRefresh();
							self1.refresh(true);//重置上拉
							
						},500)
					});
				}
			},
			up: {//上拉
				callback: function() {
					self1 = this;
					fn.getList(function(e){ 
						console.log(JSON.stringify(e));
						if(e.code == 1){ 
							page1++ 
							item1.$data.List = item1.$data.List.concat(e.data)
							self1.endPullUpToRefresh();
//							console.log(JSON.stringify(item1.$data.List));
						}else{
							self1.endPullUpToRefresh(true);
						}
					});
				},
				auto:true,//可选,默认false.自动上拉加载一次 
			}
		});
	}
	fn.pullTo2 = function(){
		mui("#scroll2 .mui-scroll").pullToRefresh({ 
			down: {  
				callback: function() { 
					self = this;
					page = 1;

					fn.getItem2List(function(e){ 

						setTimeout(function(){
							if(e.code == 1){
								page++
								item2.$data.List = [];
								item2.$data.List = item2.$data.List.concat(e.data)
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
					fn.getItem2List(function(e){
//						console.log(JSON.stringify(e));
						if(e.code == 1){ 
							page++ 
							item2.$data.List = item2.$data.List.concat(e.data)
							self.endPullUpToRefresh();
//							console.log(JSON.stringify(item2.$data.List));
						}else{
							self.endPullUpToRefresh(true);
						}
					});
				},
				auto:true,//可选,默认false.自动上拉加载一次 
			}
		});
	}
}(window.fns ? window.fns : window.fns = {})

