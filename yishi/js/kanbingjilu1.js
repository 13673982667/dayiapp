
var vm;
mui.plusReady(function(){
	vm = new Vue({
		el:'#app',
		data:{
			Info:false
		},
		methods:{
			
		},
		mounted:function(){
			if(log_id){
				fns.getOne();
			}else if(yyid){
				fns.getyOne();
			}
		}
	})
	
	
	
	//关闭填写病例页面
	setTimeout(function(){
		var target = plus.webview.getWebviewById('binglitianxie.html')
		if(target){
			target.close('none')
		}
	},500)
})

!function(fn){
	fn.getyOne = function(){
		var data = {
			url:API.url1+'api/Doctorlog/getyOne',
			yyid:yyid
		}
		common.get(data,function(e){
			if(e.code == 1){
				vm.$data.Info = e.data;
			}
		})
	}
	fn.getOne = function(){
		var data = {
			url:API.url1+'api/Doctorlog/getOne',
			log_id:log_id
		}
		common.get(data,function(e){
			if(e.code == 1){
				vm.$data.Info = e.data;
			}
		})
	}
	 
	 
	
}(window.fns ? window.fns : window.fns = {})
