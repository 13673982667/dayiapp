
!function(fn){
	//预约列表
	fn.getList = function(){
		var data = {
			url:API.url1+'api/DoctorTime/getYsDoctorList',
			uId:uId
		}
		common.get(data,function(e){
			if(e.code == 1){
//				console.log(JSON.stringify(e.data));
				vm.$data.List = e.data
			}
		}) 
	}
	//修改预约状态
	fn.updateStatus = function(k,status){
		var data = {
			url:API.url1+'api/DoctorTime/updateStatus',
			status:status || 3,//爽约
			id:vm.$data.List[k].id
		}
		common.getp(data,function(e){
//			console.log(JSON.stringify(e));
			if(e.code == 1){
//				fn.getList()
				vm.$data.List[k].status = data.status
				mui.toast('修改成功')
			}else{
				mui.toast(e.message) 
			}
		}) 
	}
	
	fn.shuangyue = function(k){
//		alert(vm.$data.List[k].id)
		fn.updateStatus(k,3)
	}
	fn.zhiliao = function(k){
//		alert(vm.$data.List[k].id)
		fn.updateStatus(k,2)
	}
	 
	 
}(window.fns ? window.fns : window.fns = {})
