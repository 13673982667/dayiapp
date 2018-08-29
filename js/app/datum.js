!function(fn){
	//用户信息
	fn.getUserInfo = function(){
		var data = {
			url:API.url1+'api/Users/getUserInfo',
			uId:uId
		}
		common.get(data,function(e){
//			console.log(JSON.stringify(e));
			if(e.code == 1){ 
				$(".username").val(e.data.nickname);
				$(".tel").val(e.data.tel);
				
                $(".sex").val(e.data.sex);
                $(".picture").attr('src',e.data.pic);
                vm.$data.userInfo = e.data;
			} 
		})
	}
	fn.dpClick = function(){
		if(dpArr){
			fn.pic(dpArr)
		}else{
			var data = {
				url:API.url1+'api/Dp/getDpList' 
			}
			common.getp(data,function(e){
				if(e.code == 1){
					dpArr = e.data;
					fn.pic(dpArr) 
				}else{
					mui.toast('请稍后再试！') 
				}
			})
		}
		
	}
	fn.pic = function(e){ 
//		console.log(JSON.stringify(e));
		var data = [] 
		for(k in e){
			data.push({
				value:e[k].id,
				text:e[k].dp_name
			})
//			console.log(JSON.stringify(e[k]))
		}
		var picker = new mui.PopPicker(); 
		picker.setData(data);
		picker.show(function (selectItems) {
			var parent_id = $('.parent_id').val()
			if(parent_id != selectItems[0].value){
				mui.confirm('修改后需要店铺重新审核！','警告',['确定','取消'],function(e){
					if(e.index == 0){
						$('.dp').val(selectItems[0].text);
						$('.parent_id').val(selectItems[0].value)
						fn.updateUserDp(parent_id);
					}
				})
				
			}
			
		})
	}
	//修改店铺
	fn.updateUserDp = function(parent_id){
		var data = {
			url:API.url1+'api/Users/updateUserInfo',
			parent_id:parent_id,
			status:0,
			uId:uId  
		}
		common.postp(data,function(e){
			if(e.code == 1){
				mui.toast('修改成功，请耐心等待审核')
			}
		})
	}
	
}(window.fns ? window.fns : window.fns = {}) 
