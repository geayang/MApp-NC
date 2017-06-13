var _index =0;
var _tapindex=0;
var  applist =new Vue({
	 el:"#applist",
	 data:{
	 	applist:[],
		
	 },
	 ready:function(){
	 					mui.init({
						pullRefresh: {
							container: '#pullrefresh',
							up: {
								contentrefresh: '正在加载...',
								callback: this.pullupRefresh
							}
						}
					});
					if (mui.os.plus) {
						mui.plusReady(function() {
							setTimeout(function() {
								mui('#pullrefresh').pullRefresh().pullupLoading();
							}, 1000);
						});
					} else {
						mui.ready(function() {
							mui('#pullrefresh').pullRefresh().pullupLoading();
						});
					}
	 },
	 created:function(){
	     	
	 },
	 methods:{
	 	 tabchange:function(index){
	 	 	 if(_tapindex==index){
	 	 	     return ;
	 	 	 }else {
	 	 	 	   this.applist=[];
	 	 	 	   _index=0;
	 	 	 	   queryApproveList(getDjdl(index),this);
	 	 	 	   _tapindex=index;
//	 	 	 	   returnhead();
//	 	 	 	   mui(".mui-scroll-wrapper").scroll().reLayout();
//	 	 	 	    mui(".mui-scroll-wrapper").scroll().scrollTo(0,0,100);
	 	 	 	   //console.log(_tapindex);
	 	 	 }
	 	 },
	 	 pulldownRefresh: function  (){
	 	 	  setTimeout(function(){
	 	 	  	    mui("#pullrefresh").pullRefresh().endPulldownToRefresh();
	 	 	  },1500)
	 	 },
	 	 pullupRefresh :function  (){
	 		setTimeout(function(){
	 			mui('#pullrefresh').pullRefresh().endPullupToRefresh() ;
      	 	 	queryApproveList(getDjdl(_tapindex),this.applist);
			 },500);
		}
		
	 	
	 }
	
});
       
function queryApproveList (_djdl,self){
 	
	   var param  = new Object ();
	   param.billtype =_djdl;
	   param.index =_index;
	   if(mui.os.plus){
	   	
	   	   param.username=plus.storage.getItem("username");
	   	   console.log(param.username);
	   }else{
	   	   param.username=localStorage.getItem("username");
	   	   
	   }
	   sendUrlCmd(self,"wxApprove","querynotapps",param,function(data){
	   	         if(data!=null&&data.length>0){
	   	       		 for (i=0;i<data.length;i++) {
							self.applist.push(data[i]);
					  }
	   	        		 _index=_index+1;
                     
	 	 	 	   
	   	        }else{
	   	            	mui.toast("没有更多数据了");
	   	        	     mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	   	        }
	   });
}

function getDjdl(index){
	console.log("getDjdl");
	  if(index==0)
	     return 'all';
	  else if(index==1)
	     return 'ht';
	  else if(index==2)
	     return 'yf';
	  else if(index==3)
	     return 'bx';
	  else 
	     return 'xc';
	  
}

window.addEventListener('refresh',function (e){
	   
});



function search(){
	console.log("search");
	  var search_sender =document.getElementById("search_sender").value;
	  var search_dept  =document.getElementById("search_dept").value;
	  if((search_sender==null&&search_sender==undefined&&search_sender=='')||(search_dept==null&&search_dept==undefined&&search_dept=='')){
	  	   mui.toast("请输入查询条件");
	  }
	        param  = new Object();
			param.state='F';
			param.billtype=getDjdl(_tapindex);
			
			param.index=0;
			param.sender=search_sender;
			param.dept=search_dept;
			if(mui.os.plus){
	   	   		param.username=plus.storage.getItem("username");
	  		 }else{
	   	   		param.username=localStorage.getItem("username");
	   	   
	  		 }
	 		 sendUrlCmd(this,"wxApprove","querynotapps",param,function (data){
	  	       applist.applist=data;
	  	       applist.index=0;
	  	       mui('#topPopover').popover('hide');
	  	       _index=0;
			});
	  }

function getScreen(maxW, maxH) { 
 
                var arr = [ 
                    document.documentElement.clientWidth || document.body.clientWidth, 
                    document.documentElement.clientHeight || document.body.clientHeigth 
                ]; 
                maxW && (function() { 
                    if(arr[0] > maxW) { 
                        arr[0] = maxW; 
                    } 
                }()); 
                maxH && (function() { 
                    if(arr[1] > maxH) { 
                        arr[1] = maxH; 
                    } 
                }()); 
                return arr; 
            } 
   function returnhead(){
   	if(mui.os.android)
   	   		window.scrollTo(0, 0);
   	   else 
   	        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);
   }

   function approve(data_index){
   	     var approveinfo =applist.applist[data_index];
   	     if(approveinfo){
   	     	  var _url =getApproveUrl(approveinfo.billtype);
   	     	         
   	     	        mui.openWindow({
   	     	        	      url:_url,
   	     	        	      id:_url,
   	     	        	       extras:{
   	     	        	       	     billid:approveinfo.billid,
   	     	        	       	     billtype:approveinfo.billtype
   	     	        	       }
   	     	        });
   	     }else{
   	     	  mui.toast("没有审批的数据");
   	     }
   }
   
   
   function getApproveUrl(djdl){
   	     switch (djdl){
   	     	case 'ht':
   	     	    return 'approve.html';
   	     	default:
   	     		return 'approve.html'
   	     }
   }