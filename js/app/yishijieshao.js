(function(fn){
	
	//医师信息
	fn.getYsInfo = function(){
		var data = {
			url:API.url1+'api/Doctor/getYsInfo',
			yId:yId,
			Time:Time
		}
		common.get(data,function(e){ 
//			console.log(JSON.stringify(e));
			if(e.code == 1){
				vm.$data.timetypeInfo = e.data.info
				vm.$data.ysInfo = e.data   
			} 
		});
	}

	//获取一条信息   
	fn.getOneInfo = function(){
		var data = {
			url:API.url1+'api/Doctortime/getOneInfo',
			id:update    
		}  
		common.get(data,function(e){
//			console.log('---'+JSON.stringify(e));			  
			if(e.code == 1){   
				vm.$data.ysInfo = e.data
				vm.$data.timetypeInfo = e.data.yInfo 
				vm.$data.isTimeType = e.data.timetype   
				vm.$data.Time = e.data.date_time 
				yId = e.data.yid
				dId = e.data.did  
			}   
		})  
	}
	 
	//选择好 进行预约
	fn.setYsTime = function(){ 
		if($('.time1').find('.people').html() == '约满'){
			return mui.toast('这个时间段预约满了');
		}
		var data = { 
			url:API.url1+'api/Doctortime/setDoctorTime',
			uid:uId,
			yid:yId, 
			timetype:vm.$data.isTimeType,
			date_time:vm.$data.Time,
			isUpdate:vm.$data.isUpdate,
			dId:dId, 
		}  
		common.getp(data,function(e){  
//			console.log(JSON.stringify(e));
			if(e.code == 1){
				mui.toast(e.message) 
				fn.fire(); 
			}else{
				mui.toast(e.message)
			}
			//关闭页面 通知前一个页面刷新
			
		});
	} 
	//通知
	fn.fire = function(){ 
		//先通知
		//ca数组发送通知
		var arr = ['appointment.html'];
		ca.sendNotice(arr,'Refresh',{});
		mui.back();		
	}
	  
}(window.fns ? window.fns : window.fns = {}))
 