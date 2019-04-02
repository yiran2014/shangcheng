var mongoose =require('mongoose')
//获取表模型
var Schema=mongoose.Schema;


var productSchema=new Schema({
	"productId" : String,
    "productName" : String,
    "salePrice" : Number,
    "productImage" : String,
    "productNum":String,
    "checked":String
});
//数据库里面的集合（表）goods一定要加s，否则这里的Good和数据库的goods关联不上去的。因为会根据加了s去查找
//如果数据库的集合没有加s，这里可以指定，module.exports=mongoose.model('Good',productSchema,'good');
module.exports=mongoose.model('Good',productSchema);
//module.exports=productSchema;

