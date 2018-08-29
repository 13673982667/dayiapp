var page = 1;
var size = 10;

function item1(){
	item1 = new Vue({
		el:'#item1',
		data:{
			List:[] 
		},
		methods:{
			//删除一个数据
			deleteOne:function(id,index){
				var data = {
					url:API.url1+'api/Doctortime/deleteOne',
					id:id
				}
				common.getp(data,function(e){
					console.log(JSON.stringify(e));
					if(e.code == 1){
						//从数组的第2个下标开始截一位 同时插入一位
						item1.List.splice(index,1)  
						mui.toast('删除成功') 
					}else{
						mui.toast(e.message)
					}
				});
			},
			//修改
			updateOne:function(id){
				mui.openWindow({
					url:'yishijieshao.html?update='+id,
					id:'yishijieshao.html'
				}) 
			}
		},
		mounted:function(){  
//					//获取列表
			fns.getList();
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
			fns.pullTo();
        },
		updated:function(){
//					mui('.mui-slider-group').scroll()
//					var slider = mui('.mui-slider').slider();
		}
	})
}
!function(fn){
	//获取我的预约列表  正在预约的
	fn.getList = function (){ 
		var data = { 
			url:API.url1+'api/Doctortime/getDoctorTimeList', 
			uId:uId,
		}
		common.get(data,function(e){ 
//					console.log(JSON.stringify(e));  
			if(e.code == 1){
				item1.$data.List = e.data
			} 
		})
	}
	//预约历史
	fn.getItem2List = function(Callback){
		var data = { 
			url:API.url1+'api/Doctortime/getDoctorTimeListBefore', 
			uId:uId,
			page:page,
			size:size
		}
		common.get(data,Callback)
	}
	
	fn.pullTo = function(){
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
						if(e.code == 1){
							page++
							item2.$data.List = item2.$data.List.concat(e.data)
							self.endPullUpToRefresh();
							console.log(JSON.stringify(item2.$data.List));
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