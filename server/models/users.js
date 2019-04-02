var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
	"userId":String,
	"userName":String,
	"userPwd":String,
	"orderList":Array,
	"carList":[{
		"productId":String,
		"productName":String,
		"productImage":String,
		"salePrice":String,
		"productNum":String,
		"checked":String
	}],
	"addressList":[ 
        {
            "addressId" : String,
            "userName" : String,
            "streetName" : String,
            "postCode" : String,
            "tel" : String,
            "isDefault" : Boolean
        }]
});
module.exports=mongoose.model('User',userSchema);