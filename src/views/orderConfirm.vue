<template>
	<div>
		
    <nav-header></nav-header>
   <nav-bread>
   	<span>订单确认</span>
   </nav-bread>
    
    <div class="container">
      <div class="checkout-order">
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确认</span> 地址</li>
            <li class="cur"><span>查看</span> 订单</li>
            <li><span>付</span> 款</li>
            <li><span>订单</span> 确认</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>订单详情</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>订单内容</li>
                <li>价格</li>
                <li>数量</li>
                <li>总价</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" v-show="item.checked==='1">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="'/static/'+item.productImage" alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productNum*item.salePrice | currency('¥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>条目总价:</span>
                <span>¥{{itemTotal}}</span>
              </li>
              <li>
                <span>配送费:</span>
                <span>¥{{shipping}}</span>
              </li>
              <li>
                <span>折扣:</span>
                <span>¥{{discount}}</span>
              </li>
              <li>
                <span>税费:</span>
                <span>¥{{tax}}</span>
              </li>
              <li class="order-total-price">
                <span>订单总价:</span>
                <span>¥{{orderTotal}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">            
            <router-link class="btn btn--m" to="/address">上一页</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="payMent">支付</button>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
 
	
	</div>
</template>
<script>
 import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/Footer.vue'
  import NavBread from '../components/Bread.vue'
  import axios from 'axios'
	export default{
		data(){
			return{
				cartList:[],
				itemTotal:0,
				orderTotal:0,
				shipping:100,
				discount:200,
				tax:50
			}
		},
		components:{
			NavHeader,
			NavFooter,
			NavBread
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				axios.get("users/cartList").then((response)=>{
					this.cartList=response.data.result;
					this.cartList.forEach((item)=>{
						if(item.checked==='1'){
							this.itemTotal += item.productNum*item.salePrice;
						}
					});
					this.orderTotal=this.itemTotal+this.shipping+this.tax-this.discount
				});
			},
			payMent(){
				axios.post("users/payMent",{
					orderTotal:this.orderTotal,
					addressId:this.$route.query.addressId
				}).then((response)=>{
					var res=response.data;
					if(res.status=='0'){
						this.$router.push({
							path:'/orderSuccess?orderId='+res.result.orderId
						});
					}
				});
			}
		}
	}
</script>