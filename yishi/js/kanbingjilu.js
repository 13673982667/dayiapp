var vm;
var page = 1;
var size = 1;
var self;
mui.plusReady(function(){
	vm = new Vue({
		el:'#app',
		data:{
			List:[]
		},
		methods:{
			liClick:function(e){
//				console.log(this.$data.List[e].id) 
				//有没有病例 有直接打开 没有就填写病例
				if(this.$data.List[e].log_id){
					mui.openWindow({
						url:'binglitianxie1.html?yyid='+this.$data.List[e].id,
						id:'binglitianxie1.html'
					}) 
				}else{ 
					mui.openWindow({
						url:'binglitianxie.html?tid='+this.$data.List[e].id,
						id:'binglitianxie.html'
					})
				}
			}
		},
		mounted:function(){ 
//			fns.getList()
			fns.pullTo();//加载上拉刷新下拉加载
		}
	})
})
setTimeout(function(){
	
},1000)

!function(fn){ 
	//看病记录列表
	fn.getList = function(callback){
		var data = {
			url:API.url1+'api/DoctorTime/getYsOkList',
			uId:uId,
			page:page,
			size:size
		}
		common.get(data,callback)
	}
	
	fn.pullTo = function(){
		mui("#refreshContainer .mui-scroll").pullToRefresh({
			up: {//上拉
				callback: function() {
					self = this;
					fn.getList(function(e){
//						console.log(JSON.stringify(e));
						if(e.code == 1){
							page++;
							vm.$data.List = vm.$data.List.concat(e.data)
							self.endPullUpToRefresh();
						}else{
							self.endPullUpToRefresh(true);
						}
					})
				},
				auto:true,//可选,默认false.自动上拉加载一次 
			}
		});
	}
}(window.fns ? window.fns : window.fns = {})
