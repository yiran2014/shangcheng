<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>结账</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确认</span> 地址</li>
            <li class="cur"><span>查看</span> 订单</li>
            <li class="cur"><span>付</span> 款</li>
            <li class="cur"><span>订单</span> 确认</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>恭喜! <br>你的订单正在处理中!</h3>
            <p>
              <span>订单号：{{orderId}}</span>
              <span>订单总价：{{orderTotal | currency('¥')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">购物车 列表</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">商品 列表</router-link>
              </div>
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
  import axios from 'axios'
    export default{
        data(){
            return{
            	orderId:'',
            	orderTotal:''
            }
        },
        components:{
        	NavHeader,
        	NavFooter
        },
        mounted(){
        	this.init()
        },
        methods:{
        	init(){
        		axios.get("/users/orderSuccess",{params:{
         			orderId:this.$route.query.orderId       			
        		}
        		}).then((response)=>{
        			var res=response.data;
        			if(res.status=='0'){
        				this.orderId=res.result.orderId,
        				this.orderTotal=res.result.orderTotal
        			}
        		});
        	}
        }
    }
</script>
