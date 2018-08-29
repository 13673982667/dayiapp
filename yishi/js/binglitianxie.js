var vm;

mui.plusReady(function(){
	vm = new Vue({
		el:'#app',
		data:{
			info:[],
			shops:[],
		},
		methods:{
			sexClick:fns.sexClick,
			shops_nameClick:fns.shops_nameClick,
			date_timeClick:fns.date_timeClick,
		},
		mounted:function(){
			fns.getbinglibefore()
		}
		
	})
})
!function(fn){
	
	//获取
	fn.getbinglibefore = function(){
		var data = {
			url:API.url1+'api/DoctorTime/getbinglibefore',
			tid:tid,
		}
		common.getp(data,function(e){
//			 console.log(JSON.stringify(e));
			 if(e.code == 1){
			 	vm.$data.info = e.data.tres
			 	vm.$data.shops = e.data.shops
			 	
			 	
			 }
		}) 
	}
	//性别
	fn.sexClick = function(){
		var picker = new mui.PopPicker(); 
		picker.setData([
			{value:'0',text:'男'},
			{value:'1',text:'女'},
		]);
		
		picker.show(function (selectItems) {
		    vm.$data.info.usex = selectItems[0].value;//智子
//		    console.log(selectItems[0].value);//zz 
		})
	}
	//症状
	fn.shops_nameClick = function(){
		var data = [];
		for(k in vm.$data.shops){
			data.push({
				value:vm.$data.shops[k].id,
				text:vm.$data.shops[k].disease,
			})
		}
		var picker = new mui.PopPicker(); 
		picker.setData(data);
		picker.show(function (selectItems) {
		    vm.$data.info.disease = selectItems[0].text;//智子
		})
	}
	//日期
	fn.date_timeClick = function(){
		var dtPicker = new mui.DtPicker({
			type:'date',
			beginYear:2017,
			endDate:new Date()
		});
	    dtPicker.show(function (selectItems) { 
//	        console.log(selectItems.y);//{text: "2016",value: 2016} 
//	        console.log(selectItems.m);//{text: "05",value: "05"} 
			console.log(JSON.stringify(selectItems));
			var time = selectItems.y.text + '-' + selectItems.m.text + '-' + selectItems.d.text
			vm.$data.info.date_time = time;
	    })
	}
	
}(window.fns ? window.fns : window.fns = {})

//完成
$('.ok').on('tap',function(){
	var data = {
		url:API.url1+'api/DoctorLog/addOne',
		tid:tid,
		name:$('#name').text(),
		sex:$('#sex').text(),
		shops_name:$('#shops_name').text(),
		date_time:$('#date_time').text(),
		phone:$('#phone').text(),
		describe:$('#describe').val(),
		solvent:$('#solvent').val(),
		yid:uId,
		uid:vm.$data.info.uid
	}
	if(data.describe == ''){ 
		return mui.toast('请填写病情') 
	}
	if(data.solvent == ''){
		return mui.toast('请填写解决方法')
	} 
	common.postp(data,function(e){  
//		console.log(JSON.stringify(e))
		if(e.code == 1){
			mui.toast('ok');
			mui.openWindow({
				url:'binglitianxie1.html?id='+e.data,
				id:'binglitianxie1.html'
			})
		}
	})
//	console.log(JSON.stringify(data));
	
})
