var vm;
mui.plusReady(function(){
	vm = new Vue({
		el:'#main',
		data:{
			shops:{}
		},
		methods:{
			_720:function(){
				mui.openWindow({
					url:'720/index.html',
					id:'720/index.html', 
					styles:{
						popGesture:'none'
					} 
				})
			}, 
			openWindow:function(e){
				//如果打开的页面是咨询
				if(e == 'im.html'){
					if(uType == 2){//医师
						e = 'yishi/im.html';
					}else if (uType == 3){//店铺
						e = 'yishi/im.html';
					}
				}
				 
				mui.openWindow({
					url:e,
					id:e,
				})
			} 
		},
		mounted:function(){
			fns.getShops();
			fns.swiper();
		}
	})
	
}) 
!function(fn){
	
	//获取症状列表
	fn.getShops = function(){
		var data = {
			url:API.url1+'api/index/index'
		};
		common.get(data,function(e){
			if(e.code == 1){
				vm.shops = e.data.Shops
			}
//			console.log(JSON.stringify(vm.$data.shops));
		});
	} 
	fn.swiper = function(){
		var banner = new Swiper('.banner', {
			autoplay: 5000,
			pagination: '.swiper-pagination',
			paginationClickable: true,
			lazyLoading: true,
			loop: true, 
			effect: 'fade',  
	        fade: {  
	             crossFade: false,
	        }  
		});
	}
}(window.fns ? window.fns : window.fns = {})
