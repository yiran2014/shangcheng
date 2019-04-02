var express = require('express');
var router = express.Router();
require('../utils/util.js');
var User=require('../models/users.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',function(req,res,next){
	var userName=req.body.userName;
	var userPwd=req.body.userPwd;

	var params={
		userName:userName,
		userPwd:userPwd
	};
	User.findOne(params,function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			if(doc){
				res.cookie("userId",doc.userId,{
					path:'/',
					maxAge:1000*60*60
				});
				res.cookie("userName",doc.userName,{
					path:'/',
					maxAge:1000*60*60
				});
				res.json({
				status:'0',
				msg:'',
				result:{
					userName:doc.userName
				}
			});
			}else{
				
				res.json({
					status:'2',
					msg:'账号密码不对'
				})
			}
		}
	});
});
router.post("/loginout",function(req,res,next){
	res.cookie('userId','',{
		path:'/',
		maxAge:'-1'
	});
	res.json({
		status:'0',
		msg:'',
		result:''
	});
});

router.get("/checkLogin",(req,res,next)=>{
	if(req.cookies.userId){
		res.json({
			status:'0',
			msg:'已经登录',
			result:req.cookies.userName
		});
	}else{
		res.json({
			status:'1',
			msg:'未登录',
			result:''
		});
	}
});
//查询当前用户的购物车数据
router.get("/cartList",(req,res,next)=>{
	
	User.findOne({userId:req.cookies.userId},function(err,doc){
		if(err){
			res.json({
			status:'1',
			msg:err.message,
			result:''
		});
		}else{
			if(doc){
				// console.log(doc);
			res.json({
				status:'0',
				msg:'',
				result:doc.carList
			});
		}
		}
	});

});
//购物车删除
router.post("/cartDel",(req,res,next)=>{
	var userId=req.cookies.userId;
	var productId=req.body.productId;
	User.update({userId:userId},{$pull:{'carList':{'productId':productId}}},(err,doc)=>{
		if(err){
			res.json({
			status:'1',
			msg:err.message,
			result:''
		});
		}else{
			
			res.json({
				status:'0',
				msg:'',
				result:'success'
			});
		
		}
	});
});

//编辑购物车
router.post('/editCart',(req,res,next)=>{
	var userId=req.cookies.userId;
	var productId=req.body.productId;
	var productNum=req.body.productNum;
	var checked=req.body.checked;
	User.update({"userId":userId,"carList.productId":productId},{
		"carList.$.productNum":productNum,
		"carList.$.checked":checked
	},(err,doc)=>{
		if(err){
			res.json({
			status:'1',
			msg:err.message,
			result:''
		});
		}else{
			
			res.json({
				status:'0',
				msg:'',
				result:'success'
			});
		
		}
	});
});
router.post('/checkAll',(req,res,next)=>{
	var userId=req.cookies.userId;
	var checkAllFlag=req.body.checkAllFlag;
	User.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			if(doc){
				doc.carList.forEach((item)=>{
					item.checked=checkAllFlag;
				});
			};
			doc.save((err2,doc2)=>{
							if(err2){
						res.json({
							status:'1',
							msg:err2.message,
							result:''
						});
					}else{
						res.json({
							status:'0',
							msg:'',
							result:'success'
						});
					}
			});
		}
	});	
});

router.post('/address',(req,res,next)=>{
	User.findOne({userId:req.cookies.userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			if(doc){
				res.json({
					status:'0',
					msg:'',
					result:doc.addressList
				});
			}
		}
	});
});

router.post("/setDefault",(req,res,next)=>{
	var addressId=req.body.addressId;
	User.findOne({userId:req.cookies.userId},(err,doc)=>{
		if(err){
			res.json({
				status:'0',
				msg:err.message,
				result:''
			});
		}else{
			
				doc.addressList.forEach((item)=>{
					if(addressId==item.addressId){
						console.log(item.addressId);
						console.log(item.isDefault);
						item.isDefault=true;
						console.log(item.isDefault);
					}else{
						console.log(item.addressId);
						item.isDefault=false;
					}
				});	
				doc.save((err1,doc1)=>{
					if(err1){
						res.json({
							status:'1',
							msg:err1.message,
							result:''
						});
					}else{
						res.json({
							status:'0',
							msg:'success',
							result:addressId
						});
					}
				});	
		}
	});
});
router.post("/delAdresss",(req,res,next)=>{
	User.update({userId:req.cookies.userId},{$pull:{addressList:{addressId:req.body.addressId}}},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			if(doc){
				res.json({
					status:'0',
					msg:'success delAdresss',
					result:''
				});
			}
		}
	});
});
router.post("/payMent",(req,res,next)=>{
	var addressId=req.body.addressId;
	var orderTotal=req.body.orderTotal;
	var userId=req.cookies.userId;
	User.findOne({userId:userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			var address='';var goodsList=[];
			doc.addressList.forEach((item)=>{
				if(addressId==item.addressId){
					address=item;
				}
			});
			doc.carList.forEach((item)=>{
				if(item.checked=='1'){
					goodsList.push(item);
				}
			});
			var r1=Math.floor(Math.random()*10);
			var r2=Math.floor(Math.random()*10);
			var sysData=new Date().Format('yyyyMMddhhmmss');
			var createDate=new Date().Format('yyyy-MM--dd hh:mm:ss');
			var platform='662';
			var orderId=platform+r1+sysData+r2;
			var order={
				orderId:orderId,
				orderTotal:orderTotal,
				goodsList:goodsList,
				addressInfo:address,
				orderStatus:'1',
				createDate:createDate
			};
			doc.orderList.push(order);
			doc.save((err1,doc1)=>{
				if(err1){
					res.json({
						status:'1',
						msg:err.message,
						result:''
					});
				}else{
					res.json({
						status:'0',
						msg:'success',
						result:{
							orderId:orderId,
							orderTotal:orderTotal
							}
						});
				}
			});
			
		}
	});
});
router.get("/orderSuccess",(req,res,next)=>{
	User.findOne({userId:req.cookies.userId},(err,userInfo)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			console.log(0);
			userInfo.orderList.forEach((item)=>{
				if(item.orderId==req.param("orderId")){
					res.json({
						status:'0',
						msg:'',
						result:{
							orderTotal:item.orderTotal,
							orderId:item.orderId
						}
					});
				}
			});
		}
	});
});
router.get("/CartCount",(req,res,next)=>{
	User.findOne({userId:req.cookies.userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			var cartCount=0
			doc.carList.forEach((item)=>{
				cartCount +=parseInt(item.productNum);
			});
			res.json({
				status:'0',
				msg:'succ',
				result:cartCount
			});
		}
	});

});
module.exports = router;
