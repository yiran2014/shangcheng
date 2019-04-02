var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Goods=require('../models/goods');
//连接MongoDB数据库
mongoose.connect('mongodb://47.99.90.153:27017/Goods');

mongoose.connection.on('connected',function(){
	console.log("success");
});

mongoose.connection.on('error',function(){
	console.log("failed");
});
//查询商品列表数据
router.get("/list",function(req,res,next){
	

	// Goods.find({},function(err,doc){
	// 	if(err){
	// 		res.json({
	// 			status:'1',
	// 			msg:err.message
	// 		});
	// 	}else{
	// 		res.json({
	// 			status:'0',
	// 			msg:'',
	// 			result:{
	// 				count:doc.lenght,
	// 				list:doc
	// 			}
	// 		});
	// 	}
	// });
	var page=parseInt(req.param("page"));
	var pageSize=parseInt(req.param("pageSize"));
	var sort=req.param("sort");
	var params={};
	//var goodsModel=Goods.find(params);
	var priceLevel=req.param("priceLevel");
	var priceGt=0;
	var priceLte=5000;
	if(priceLevel != 'all'){
		switch(priceLevel){
		case '0':
			priceGt=0;
			priceLte=100;
		break;
		case '1':
			priceGt=100;
			priceLte=500;
		break;
		case '2':
			priceGt=500;
			priceLte=1000;
		break;
		case '3':
			priceGt=1000;
			priceLte=5000;
		break;
		}
	}
	params={
		salePrice:{
			$gt:priceGt,
			$lte:priceLte
		}
	};
	
	var skip=(page-1)*pageSize;
	var GoodsModel=Goods.find(params).skip(skip).limit(pageSize);
	GoodsModel.sort({'salePrice':sort});

	GoodsModel.find(function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			});
		}
	});
	});
//加入到购物车
router.post("/addCart",function(req,res,next){
	// console.log(33333333333333);
	var userId="100000077";
	var productId=req.body.productId;
	var User=require("../models/users.js");
	User.findOne({userId:userId},function(err,userDoc){
		if(err){
			res.json({
				status:"1",
				msg:err.message
			})
		}else{
			// console.log("userDoc"+userDoc);
				var goodItem='';
				userDoc.carList.forEach((item)=>{
					if(item.productId==productId){
						item.productNum++;
						goodItem=item;
					}
				});
			
				if(goodItem){
					userDoc.save(function(err2,doc2){
						if(err2){
							res.json({
								status:"1",
								msg:err2.message
							})
						}else{
							res.json({
								status:"0",
								msg:"添加成功",
								result:"succ"
							})
						}
					});
				}else{
Goods.findOne({productId:productId},function(err1,doc1){
				if(err1){
					res.json({
						status:"1",
						msg:err1.message
					});
				}else{
					doc1.productNum=1;
					doc1.checked=1;
					userDoc.carList.push(doc1);
					userDoc.save(function(err2,doc2){
						if(err2){
							res.json({
								status:"1",
								msg:err2.message
							})
						}else{
							res.json({
								status:"0",
								msg:"添加成功",
								result:"succ"
							})
						}
					});
				}
			});
				};


			// Goods.findOne({productId:productId},function(err1,doc1){
			// 	if(err1){
			// 		res.json({
			// 			status:"1",
			// 			msg:err1.message
			// 		});
			// 	}else{
			// 		doc1.productNum=1;
			// 		doc1.checked=1;
			// 		userDoc.carList.push(doc1);
			// 		userDoc.save(function(err2,doc2){
			// 			if(err2){
			// 				res.json({
			// 					status:"1",
			// 					msg:err2.message
			// 				})
			// 			}else{
			// 				res.json({
			// 					status:"0",
			// 					msg:"添加成功",
			// 					result:"succ"
			// 				})
			// 			}
			// 		});
			// 	}
			// });
		}
	});
});
module.exports = router;